"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Arrow } from "@/src/components/icon";
import { TAB_STORAGE_KEY, useRequests } from "@/src/contexts/RequestsContext";
import type { LabRequest } from "@/src/types/requests";

interface CompleteFormViewProps {
  request: LabRequest;
}

const waveformHeights = [12, 24, 18, 30, 16, 28, 14, 26, 20, 32, 18, 24];

export default function CompleteFormView({ request }: CompleteFormViewProps) {
  const t = useTranslations();
  const router = useRouter();
  const { completeRequest } = useRequests();
  const [reportText, setReportText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const hasReport = reportText.trim().length > 0 || voiceNote.length > 0;

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

  const toggleRecording = () => {
    if (isRecording) {
      setVoiceNote(t("voiceReportMock"));
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setVoiceNote("");
  };

  const handleSubmit = async () => {
    if (!hasReport) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await completeRequest(request.id, {
        type: voiceNote ? "voice" : "text",
        content: voiceNote || reportText.trim(),
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
    <div className="pb-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm font-semibold text-primary"
      >
        <Arrow className="h-4 w-4 rotate-90" color="#0D50FF" />
        {t("back")}
      </button>

      <h1 className="mb-4 text-base font-bold text-text">{t("completeFormTitle")}</h1>

      <div className="rounded-2xl border-2 border-primary/20 bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-sm text-text/40">{t("serviceReportPlaceholder")}</p>
          <button
            type="button"
            onClick={toggleRecording}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
              isRecording ? "bg-red-500" : "bg-primary"
            }`}
            aria-label={t("recordVoice")}
          >
            <MicrophoneIcon active={isRecording} />
          </button>
        </div>

        <textarea
          value={reportText}
          onChange={(event) => setReportText(event.target.value)}
          placeholder={t("serviceReportPlaceholder")}
          className="min-h-[120px] w-full resize-none bg-transparent text-sm text-text outline-none"
        />

        {(isRecording || voiceNote) && (
          <div className="mt-4 flex items-end justify-center gap-1 py-4">
            {isRecording ? (
              <div className="flex animate-pulse items-end gap-1">{waveform}</div>
            ) : (
              <p className="text-center text-xs text-teal">{voiceNote}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {submitError && (
          <p className="col-span-2 text-center text-sm text-red-500">{submitError}</p>
        )}
        <button
          type="button"
          disabled={!hasReport || isSubmitting}
          onClick={handleSubmit}
          className="rounded-2xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-primary/90 disabled:opacity-50"
        >
          {t("submitForm")}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-2xl border-2 border-primary py-3 text-sm font-bold text-primary transition hover:bg-primary/5"
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
