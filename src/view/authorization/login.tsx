"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  AppleVector,
  Eye,
  EyeOff,
  GoogleColorVector,
  Lock,
  Mail,
} from "@/src/components/icon";
import { useLocalizedDigits } from "@/src/hooks/useLocalizedDigits";
import {
  getApiErrorMessage,
  loginNurse,
  saveNurseSession,
} from "@/src/lib/auth";
import { extractDigits } from "@/src/utils/digits";
import AuthHeader from "./AuthHeader";
import EnteringPanel from "./EnteringPanel";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginView() {
  const t = useTranslations();
  const { display } = useLocalizedDigits();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enteringPanel, setEnteringPanel] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const isEmail = EMAIL_RE.test(emailOrPhone.trim());
    const cleanedPhone = extractDigits(emailOrPhone);
    const phoneOk = /^[0-9]{11}$/.test(cleanedPhone);

    if (!isEmail && !phoneOk) {
      setError(t("emailOrPhone_invalid"));
      return;
    }
    if (!password.trim()) {
      setError(t("password_required"));
      return;
    }

    setLoading(true);
    try {
      const { ok, result, tokens } = await loginNurse({
        email: isEmail ? emailOrPhone.trim() : "",
        phoneNumber: !isEmail ? cleanedPhone : "",
        password,
      });

      if (!ok || !tokens.token) {
        setError(getApiErrorMessage(result, t("login_error")));
        setLoading(false);
        return;
      }

      saveNurseSession(tokens, {
        userEmail: isEmail ? emailOrPhone.trim() : "",
        userPhone: !isEmail ? cleanedPhone : "",
      });

      setEnteringPanel(true);
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
      setError(t("login_error"));
      setLoading(false);
    }
  };

  return (
    <>
      {enteringPanel && <EnteringPanel message={t("entering_panel")} />}
      <div className="login-page relative z-10 flex min-h-[100dvh] w-full justify-center bg-white">
        <div className="flex w-full max-w-[390px] flex-col px-6 pb-[var(--pad-bottom)] pt-[var(--pad-top)]">
          <AuthHeader />

          <div className="mx-auto mt-[var(--gap-logo)] flex h-[calc(61px+18*var(--fit))] w-full max-w-[316px] flex-col items-center justify-center gap-[15px] px-[20px]">
            <h1 className="login-heading w-full text-center text-[16px] font-semibold capitalize leading-[16px] text-black">
              {t("title")}
            </h1>
            <p className="login-text w-full whitespace-pre-line text-center text-[10px] font-light leading-[15px] tracking-[-0.05px] text-[#252525]">
              {t("subtitle")}
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="mx-auto mt-[var(--gap-lg)] flex w-full max-w-[298px] flex-col"
          >
            <div className="flex h-[77px] w-full flex-col justify-between">
              <label
                htmlFor="emailOrPhone"
                className="login-heading text-[14px] font-semibold leading-[16px] text-black"
              >
                {t("emailOrPhone_label")}
              </label>
              <div
                className={`flex h-[45px] w-full items-center gap-2 rounded-[13px] border bg-[#FEFEFD] px-3 ${
                  error ? "border-red-500" : "border-[#E2E8F0]"
                }`}
              >
                <Mail className="pointer-events-none shrink-0" color="#2671FD" size={20} />
                <input
                  id="emailOrPhone"
                  type="text"
                  required
                  value={
                    /[A-Za-z@._-]/.test(emailOrPhone)
                      ? emailOrPhone
                      : display(emailOrPhone)
                  }
                  onChange={(event) => {
                    const raw = event.target.value;
                    setEmailOrPhone(
                      /[A-Za-z@._-]/.test(raw) ? raw : extractDigits(raw),
                    );
                    setError("");
                  }}
                  placeholder={t("emailOrPhone_placeholder")}
                  className="login-input h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#2671FD] placeholder:text-[#93B4F5] focus:outline-none focus:ring-0"
                />
              </div>
            </div>
            {error && <p className="mt-2 text-[12px] text-red-500">{error}</p>}

            <div className="mt-[var(--gap-md)] flex h-[107px] w-full flex-col justify-between">
              <label
                htmlFor="password"
                className="login-heading text-[14px] font-semibold leading-[16px] text-black"
              >
                {t("password_label")}
              </label>
              <div className="flex h-[45px] w-full items-center gap-2 rounded-[13px] border border-[#E2E8F0] bg-[#FEFEFD] px-3">
                <Lock className="pointer-events-none shrink-0" color="#2671FD" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("password_placeholder")}
                  className="login-input h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#2671FD] placeholder:text-[#93B4F5] focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="shrink-0"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye color="#2671FD" />
                  ) : (
                    <EyeOff color="#2671FD" />
                  )}
                </button>
              </div>
              <Link
                href="/reset-password"
                className="login-text self-end text-[12px] font-medium leading-[16px] text-[#2671FD] hover:underline"
              >
                {t("forgot")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`login-btn mx-auto mt-[var(--gap-md)] h-[52px] w-[230px] max-w-full rounded-[12px] text-[16px] font-bold text-white transition-all duration-300 ease-out ${
                loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-[#2563EB] hover:bg-[#1d4ed8] active:scale-[0.98]"
              }`}
            >
              {loading ? t("logging_in") : t("button")}
            </button>
          </form>

          <p className="login-text mt-[var(--gap-md)] text-center text-[12px] leading-[18px] text-[#6B7280]">
            {t("or_signup_with")}
          </p>

          <div className="mt-[var(--gap-sm)] flex flex-col items-center gap-[var(--gap-xs)]">
            <button
              type="button"
              className="login-btn flex h-[62px] w-[167px] flex-col items-center justify-center gap-0.5 rounded-2xl border border-[#E2E8F0] bg-white px-2.5 py-2.5 text-[12px] font-medium leading-none text-[#1F2937]"
            >
              <GoogleColorVector size={18} />
              {t("continue_with_google")}
            </button>
            <button
              type="button"
              className="login-btn flex h-[62px] w-[167px] flex-col items-center justify-center gap-0.5 rounded-2xl border border-[#E2E8F0] bg-white px-2.5 py-2.5 text-[12px] font-medium leading-none text-[#1F2937]"
            >
              <AppleVector size={18} />
              {t("continue_with_apple")}
            </button>
          </div>

          <p className="login-text mt-[var(--gap-md)] text-center text-[12px] leading-[18px] text-[#6B7280]">
            {t("signup_prompt")}{" "}
            <Link href="/signup" className="font-medium text-[#2563EB] hover:underline">
              {t("register_as_nurse")}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
