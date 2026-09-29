import { API_BASE } from "@/src/lib/api";
import {
  persistAuthSession,
  type AuthTokens,
} from "@/src/lib/session";

export type LoginPayload = {
  email?: string;
  phoneNumber?: string;
  password: string;
};

export type NurseRegistrationPayload = {
  firstName: string;
  lastName: string;
  academicLevel: number;
  experience: number;
  activationState: number;
  yearOfGraduation: string;
  lastUniversity: string;
  provinceId: number;
  cityId: number;
  identityUserId: string | null;
  phoneNumber: string;
  address: string | null;
  biography: string | null;
  nationalCode: string;
  isActive: boolean;
  token: string;
  password: string;
  confirmPassword: string;
  email: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function pickString(
  obj: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

export function isApiSuccess(result: unknown): boolean {
  if (!result || typeof result !== "object") return false;

  const record = result as Record<string, unknown>;
  if (record.success === false || record.isSuccess === false) return false;
  if (record.success === true || record.isSuccess === true) return true;

  return true;
}

export function getApiErrorMessage(result: unknown, fallback: string): string {
  if (!result || typeof result !== "object") return fallback;

  const record = result as Record<string, unknown>;
  const candidates = [record.error, record.message, record.title];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  if (Array.isArray(record.errors)) {
    const messages = record.errors
      .map((item) => {
        if (typeof item === "string") return item;
        const rec = asRecord(item);
        if (!rec) return "";
        return pickString(rec, ["message", "error", "description"]) ?? "";
      })
      .filter(Boolean);
    if (messages.length > 0) return messages.join(" ");
  }

  return fallback;
}

export function extractAuthTokens(result: unknown): AuthTokens {
  const root = asRecord(result) ?? {};
  const data = root.data;
  const nestedData = asRecord(data)?.data;
  const candidates: unknown[] = [nestedData, data, root];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return { token: candidate };
    }

    const rec = asRecord(candidate);
    if (!rec) continue;

    const token = pickString(rec, [
      "token",
      "Token",
      "accessToken",
      "AccessToken",
      "jwt",
      "Jwt",
    ]);
    if (!token) continue;

    return {
      token,
      refreshToken: pickString(rec, ["refreshToken", "RefreshToken"]),
      expiration: pickString(rec, [
        "expiration",
        "Expiration",
        "expiresAt",
        "ExpiresAt",
      ]),
    };
  }

  return {};
}

async function postJson(path: string, body?: unknown) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const result = await response.json().catch(() => ({}));
  return {
    ok: response.ok && isApiSuccess(result),
    result,
  };
}

export async function loginNurse(params: LoginPayload) {
  const { ok, result } = await postJson("/Auth/LoginNurse", {
    email: params.email || "",
    phoneNumber: params.phoneNumber || "",
    password: params.password,
  });

  return {
    ok,
    result,
    tokens: extractAuthTokens(result),
  };
}

export async function requestOtp(phoneNumber: string) {
  return postJson("/Auth/request-otp", { phoneNumber });
}

export async function verifyOtp(phoneNumber: string, code: string) {
  const posted = await postJson("/Auth/verify-otp", { phoneNumber, code });
  return {
    ...posted,
    tokens: extractAuthTokens(posted.result),
  };
}

export async function registerNurse(payload: NurseRegistrationPayload) {
  return postJson("/Auth/RegisterNurse", payload);
}

export async function generatePasswordResetToken(phoneNumber: string) {
  const posted = await postJson("/Auth/generate-password-reset-token", {
    phoneNumber,
  });
  return {
    ...posted,
    tokens: extractAuthTokens(posted.result),
  };
}

export async function forgetPassword(params: {
  phoneNumber: string;
  newPassword: string;
  token: string;
  otpCode: string;
}) {
  return postJson("/Auth/ForgetPassword", params);
}

export function saveNurseSession(
  tokens: AuthTokens,
  extras?: { userName?: string; userEmail?: string; userPhone?: string },
) {
  persistAuthSession(tokens, extras);
}
