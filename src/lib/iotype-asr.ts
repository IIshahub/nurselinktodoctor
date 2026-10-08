export type IotypeModel = "io-fa" | "io-en" | "io-ar";

export const IOTYPE_REALTIME_URL = "wss://iotype.com/socket/realtime";
export const IOTYPE_CAPTURE_WORKLET_URL = "/audio/iotype-capture-worklet.js";

export function localeToIotypeModel(locale: string): IotypeModel {
  if (locale.startsWith("ar")) return "io-ar";
  if (locale.startsWith("en")) return "io-en";
  return "io-fa";
}

export class StreamingResampler {
  private ratio: number;
  private position = 0;
  private tail = new Float32Array(0);
  outputRate: number;

  constructor(inputRate: number, outputRate: number) {
    this.ratio = inputRate / outputRate;
    this.outputRate = outputRate;
  }

  process(input: Float32Array): Float32Array {
    const data = new Float32Array(this.tail.length + input.length);
    data.set(this.tail);
    data.set(input, this.tail.length);

    const output: number[] = [];
    while (this.position + 1 < data.length) {
      const left = Math.floor(this.position);
      const fraction = this.position - left;
      output.push(data[left] + (data[left + 1] - data[left]) * fraction);
      this.position += this.ratio;
    }

    this.position -= data.length - 1;
    this.tail = data.slice(-1);
    return Float32Array.from(output);
  }
}

export function float32ToPcm16(samples: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(samples.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < samples.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  return buffer;
}

export async function fetchIotypeFlashToken(): Promise<string> {
  const response = await fetch("/api/iotype/flash-token", { method: "POST" });
  const result = (await response.json().catch(() => ({}))) as {
    token?: string;
    error?: string;
  };

  if (!response.ok || !result.token) {
    throw new Error(result.error || "flash_token_failed");
  }

  return result.token;
}
