"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Arrow } from "@/src/components/icon";
import { TAB_STORAGE_KEY, useRequests } from "@/src/contexts/RequestsContext";
import {
  fetchIotypeFlashToken,
  float32ToPcm16,
  IOTYPE_CAPTURE_WORKLET_URL,
  IOTYPE_REALTIME_URL,
  localeToIotypeModel,
  StreamingResampler,
} from "@/src/lib/iotype-asr";
import type { CareRequest } from "@/src/types/requests";

interface CompleteFormViewProps {
  request: CareRequest;
}

const waveformHeights = [12, 24, 18, 30, 16, 28, 14, 26, 20, 32, 18, 24];
const EOF_WAIT_MS = 3000;

type AudioGraph = {
  stream: MediaStream;
  context: AudioContext;
  source: MediaStreamAudioSourceNode;
  node: AudioWorkletNode;
  mute: GainNode;
};

export default function CompleteFormView({ request }: CompleteFormViewProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { completeRequest } = useRequests();
  const [reportText, setReportText] = useState("");
  const [partialText, setPartialText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [usedVoice, setUsedVoice] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<AudioGraph | null>(null);
  const resamplerRef = useRef<StreamingResampler | null>(null);
  const queueRef = useRef(new Float32Array(0));
  const stoppingRef = useRef(false);
  const gotFinalRef = useRef(false);
  const eofTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasReport = reportText.trim().length > 0;

  const closeAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.node.disconnect();
      audio.source.disconnect();
      audio.mute.disconnect();
    } catch {
      // already disconnected
    }
    audio.stream.getTracks().forEach((track) => track.stop());
    if (audio.context.state !== "closed") {
      void audio.context.close();
    }
    audioRef.current = null;
    resamplerRef.current = null;
    queueRef.current = new Float32Array(0);
  };

  const clearEofTimer = () => {
    if (eofTimerRef.current) {
      clearTimeout(eofTimerRef.current);
      eofTimerRef.current = null;
    }
  };

  const finishSession = (options?: { error?: string; noSpeech?: boolean }) => {
    clearEofTimer();
    stoppingRef.current = true;
    const socket = wsRef.current;
    wsRef.current = null;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    closeAudio();
    setIsRecording(false);
    setIsTranscribing(false);
    setPartialText("");
    if (options?.error) setVoiceError(options.error);
    else if (options?.noSpeech) setVoiceError(t("voiceNoSpeech"));
  };

  useEffect(
    () => () => {
      clearEofTimer();
      stoppingRef.current = true;
      const socket = wsRef.current;
      wsRef.current = null;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      closeAudio();
    },
    [],
  );

  const waveform = useMemo(
    () =>
      waveformHeights.map((height, index) => (
        <span
          key={index}
          className="w-1 rounded-full bg-primary/40"
          style={{ height: `${height}px` }}
        />
      )),
    [],
  );

  const appendFinalText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    gotFinalRef.current = true;
    setUsedVoice(true);
    setReportText((previous) =>
      previous.trim() ? `${previous.trimEnd()} ${trimmed}` : trimmed,
    );
    setPartialText("");
  };

  const sendConverted = (input: Float32Array) => {
    const resampler = resamplerRef.current;
    const socket = wsRef.current;
    if (!resampler || !socket || socket.readyState !== WebSocket.OPEN) return;

    const converted = resampler.process(input);
    const joined = new Float32Array(queueRef.current.length + converted.length);
    joined.set(queueRef.current);
    joined.set(converted, queueRef.current.length);
    queueRef.current = joined;

    const size = Math.round(resampler.outputRate / 50);
    while (
      queueRef.current.length >= size &&
      socket.readyState === WebSocket.OPEN
    ) {
      socket.send(float32ToPcm16(queueRef.current.slice(0, size)));
      queueRef.current = queueRef.current.slice(size);
    }
  };

  const startRecording = async () => {
    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof AudioContext === "undefined" ||
      typeof AudioWorkletNode === "undefined"
    ) {
      setVoiceError(t("voiceNotSupported"));
      return;
    }

    stoppingRef.current = false;
    gotFinalRef.current = false;
    setIsTranscribing(true);
    setVoiceError("");
    setPartialText("");

    let socket: WebSocket | null = null;

    try {
      const token = await fetchIotypeFlashToken();
      const model = localeToIotypeModel(locale);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const context = new AudioContext();
      await context.resume();
      await context.audioWorklet.addModule(IOTYPE_CAPTURE_WORKLET_URL);

      socket = await new Promise<WebSocket>((resolve, reject) => {
        const candidate = new WebSocket(IOTYPE_REALTIME_URL);
        candidate.binaryType = "arraybuffer";
        const timer = setTimeout(
          () => reject(new Error("socket_timeout")),
          10000,
        );
        candidate.onopen = () => {
          clearTimeout(timer);
          resolve(candidate);
        };
        candidate.onerror = () => {
          clearTimeout(timer);
          reject(new Error("socket_error"));
        };
      });

      if (stoppingRef.current) {
        socket.close();
        stream.getTracks().forEach((track) => track.stop());
        await context.close();
        return;
      }

      wsRef.current = socket;

      const auth = await new Promise<{ sample_rate: number; model?: string }>(
        (resolve, reject) => {
          const timer = setTimeout(
            () => reject(new Error("auth_timeout")),
            10000,
          );
          socket!.onmessage = (event) => {
            try {
              const data = JSON.parse(String(event.data)) as {
                status?: string;
                sample_rate?: number;
                model?: string;
                error?: string;
              };
              if (data.status === "authorized" && data.sample_rate) {
                clearTimeout(timer);
                resolve({
                  sample_rate: data.sample_rate,
                  model: data.model,
                });
                return;
              }
              if (data.error) {
                clearTimeout(timer);
                reject(new Error(data.error));
              }
            } catch {
              clearTimeout(timer);
              reject(new Error("auth_invalid"));
            }
          };
          socket!.send(
            JSON.stringify({
              config: {
                model,
                type: "flash_token",
                token,
              },
            }),
          );
        },
      );

      const resampler = new StreamingResampler(
        context.sampleRate,
        auth.sample_rate,
      );
      resamplerRef.current = resampler;

      const source = context.createMediaStreamSource(stream);
      const node = new AudioWorkletNode(context, "iotype-capture-processor", {
        channelCount: 1,
        numberOfInputs: 1,
        numberOfOutputs: 1,
      });
      const mute = context.createGain();
      mute.gain.value = 0;

      node.port.onmessage = ({ data }) => {
        if (!stoppingRef.current && data instanceof Float32Array) {
          sendConverted(data);
        }
      };

      source.connect(node);
      node.connect(mute);
      mute.connect(context.destination);

      audioRef.current = { stream, context, source, node, mute };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(String(event.data)) as {
            partial?: string;
            text?: string;
            error?: string;
          };
          if (typeof data.partial === "string") {
            setPartialText(data.partial);
          }
          if (typeof data.text === "string") {
            appendFinalText(data.text);
          }
          if (data.error) {
            finishSession({ error: t("voiceTranscribeFailed") });
          }
        } catch {
          // ignore non-json frames
        }
      };

      socket.onclose = () => {
        if (!stoppingRef.current) {
          finishSession({ error: t("voiceTranscribeFailed") });
        }
      };

      setIsRecording(true);
      setIsTranscribing(false);
    } catch (error) {
      console.error("iotype realtime start failed:", error);
      if (socket && socket.readyState === WebSocket.OPEN) socket.close();
      wsRef.current = null;
      closeAudio();
      setIsRecording(false);
      setIsTranscribing(false);
      setPartialText("");

      if (
        error instanceof DOMException &&
        (error.name === "NotAllowedError" || error.name === "PermissionDeniedError")
      ) {
        setVoiceError(t("voicePermissionDenied"));
        return;
      }
      setVoiceError(t("voiceTranscribeFailed"));
    }
  };

  const stopRecording = () => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    setIsRecording(false);
    setIsTranscribing(true);
    setPartialText("");

    const audio = audioRef.current;
    if (audio) {
      try {
        audio.node.disconnect();
        audio.source.disconnect();
        audio.mute.disconnect();
      } catch {
        // already disconnected
      }
      audio.stream.getTracks().forEach((track) => track.stop());
      if (audio.context.state !== "closed") {
        void audio.context.close();
      }
      audioRef.current = null;
    }

    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      if (queueRef.current.length > 0) {
        socket.send(float32ToPcm16(queueRef.current));
        queueRef.current = new Float32Array(0);
      }
      socket.send(JSON.stringify({ eof: 1 }));
    }

    clearEofTimer();
    eofTimerRef.current = setTimeout(() => {
      const hadSpeech = gotFinalRef.current;
      finishSession(hadSpeech ? undefined : { noSpeech: true });
    }, EOF_WAIT_MS);
  };

  const toggleRecording = () => {
    if (isTranscribing) return;
    setVoiceError("");

    if (isRecording) {
      stopRecording();
      return;
    }

    void startRecording();
  };

  const handleSubmit = async () => {
    if (!hasReport) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await completeRequest(request.id, {
        type: usedVoice ? "voice" : "text",
        content: reportText.trim(),
        createdAt: new Date().toISOString(),
      });
      sessionStorage.setItem(TAB_STORAGE_KEY, "completed");
      router.replace("/");
    } catch {
      setSubmitError(t("submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-full overflow-x-hidden px-4 pt-3 pb-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-5 mt-2 flex items-center gap-1 text-sm font-semibold text-primary"
      >
        <Arrow className="h-4 w-4 shrink-0 rotate-90" color="#0D50FF" />
        {t("back")}
      </button>

      <h1 className="mb-4 break-words text-base font-bold text-text">
        {t("completeFormTitle")}
      </h1>

      <div className="min-w-0 overflow-hidden rounded-2xl border-2 border-primary/20 bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="min-w-0 flex-1 break-words text-sm text-text/40">
            {t("serviceReportPlaceholder")}
          </p>
          <button
            type="button"
            onClick={toggleRecording}
            disabled={isTranscribing || isSubmitting}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition disabled:opacity-60 ${
              isRecording ? "bg-red-500" : "bg-primary"
            }`}
            aria-label={isRecording ? t("stopRecording") : t("recordVoice")}
            aria-pressed={isRecording}
          >
            {isTranscribing ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <MicrophoneIcon active={isRecording} />
            )}
          </button>
        </div>

        <textarea
          value={reportText}
          onChange={(event) => setReportText(event.target.value)}
          placeholder={t("serviceReportPlaceholder")}
          className="min-h-[140px] w-full max-w-full resize-none bg-transparent text-sm leading-6 text-text outline-none"
        />

        {isRecording && partialText.trim() && (
          <p className="mt-2 break-words text-sm leading-6 text-text/50">
            {partialText}
          </p>
        )}

        {(isRecording || isTranscribing) && (
          <div className="mt-4 flex flex-col items-center gap-2 overflow-hidden py-4">
            {isRecording && (
              <div className="flex animate-pulse items-end gap-1">{waveform}</div>
            )}
            <p className="break-words px-1 text-center text-xs text-teal">
              {isRecording ? t("voiceRecordingHint") : t("voiceTranscribing")}
            </p>
          </div>
        )}

        {voiceError && (
          <p className="mt-2 break-words text-center text-xs text-red-500">
            {voiceError}
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 pb-4">
        {submitError && (
          <p className="col-span-2 break-words text-center text-sm text-red-500">
            {submitError}
          </p>
        )}
        <button
          type="button"
          disabled={!hasReport || isSubmitting}
          onClick={handleSubmit}
          className="rounded-2xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {t("submitForm")}
            </span>
          ) : (
            t("submitForm")
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-2xl border-2 border-primary py-3 text-sm font-bold text-primary transition hover:bg-primary/5 disabled:opacity-50"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

function MicrophoneIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z"
        fill="white"
      />
      <path
        d="M19 11a7 7 0 0 1-14 0M12 18v3"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {active && (
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1" opacity="0.4" />
      )}
    </svg>
  );
}
