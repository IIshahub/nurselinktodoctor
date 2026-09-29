"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Lock, Phone } from "@/src/components/icon";
import Toast from "@/src/components/Toast";
import { useLocalizedDigits } from "@/src/hooks/useLocalizedDigits";
import {
  forgetPassword,
  generatePasswordResetToken,
  getApiErrorMessage,
} from "@/src/lib/auth";
import { extractDigits } from "@/src/utils/digits";
import AuthHeader from "./AuthHeader";
import OTPModal from "./OTPModal";

const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!]).{8,}$/;

export default function ResetPasswordView() {
  const t = useTranslations();
  const { display } = useLocalizedDigits();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const cleaned = extractDigits(phoneNumber);
    if (!/^[0-9]{11}$/.test(cleaned)) {
      setError(t("invalid_phone"));
      return;
    }
    if (!PASSWORD_RE.test(newPassword)) {
      setError(t("password_pattern"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("passwords_not_match"));
      return;
    }

    setPhoneNumber(cleaned);
    setLoading(true);
    try {
      const posted = await generatePasswordResetToken(cleaned);
      if (!posted.ok || !posted.tokens.token) {
        const msg = getApiErrorMessage(posted.result, t("otp_send_error"));
        setError(msg);
        setToast({ message: msg, type: "error" });
        return;
      }
      setResetToken(posted.tokens.token);
      setShowOTP(true);
      setToast({ message: t("otp_sent"), type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: t("otp_send_error"), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (code: string) => {
    if (!resetToken) throw new Error(t("reset_password_error"));
    const posted = await forgetPassword({
      phoneNumber: extractDigits(phoneNumber),
      newPassword,
      token: resetToken,
      otpCode: code,
    });
    if (!posted.ok) {
      throw new Error(getApiErrorMessage(posted.result, t("reset_password_error")));
    }
    setShowOTP(false);
    setToast({ message: t("reset_password_success"), type: "success" });
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        phoneNumber={extractDigits(phoneNumber)}
        onVerify={handleOTPVerify}
      />
      <div className="login-page relative z-10 flex min-h-[100dvh] w-full justify-center bg-white">
        <div className="flex w-full max-w-[390px] flex-col px-6 pb-[var(--pad-bottom)] pt-[var(--pad-top)]">
          <AuthHeader showBack onBack={() => window.history.back()} />

          <div className="mx-auto mt-8 flex w-full max-w-[316px] flex-col items-center gap-3">
            <h1 className="login-heading text-center text-[16px] font-semibold text-black">
              {t("reset_password_title")}
            </h1>
            <p className="login-text text-center text-[12px] leading-[18px] text-[#6B7280]">
              {t("reset_password_subtitle")}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex w-full max-w-[298px] flex-col gap-4"
          >
            <label className="flex flex-col gap-1.5">
              <span className="login-heading text-[14px] font-semibold text-black">
                {t("mobileNumber_label")}
              </span>
              <div
                className={`flex h-[45px] items-center gap-2 rounded-[13px] border bg-[#FEFEFD] px-3 ${
                  error ? "border-red-500" : "border-[#E2E8F0]"
                }`}
              >
                <Phone className="shrink-0" color="#2671FD" />
                <input
                  value={display(phoneNumber)}
                  onChange={(e) => {
                    setPhoneNumber(extractDigits(e.target.value).slice(0, 11));
                    setError("");
                  }}
                  inputMode="numeric"
                  placeholder={t("mobileNumber_placeholder")}
                  className="login-input h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#2671FD] placeholder:text-[#93B4F5] focus:outline-none"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="login-heading text-[14px] font-semibold text-black">
                {t("newPassword_label")}
              </span>
              <div className="flex h-[45px] items-center gap-2 rounded-[13px] border border-[#E2E8F0] bg-[#FEFEFD] px-3">
                <Lock className="shrink-0" color="#2671FD" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("newPassword_placeholder")}
                  className="login-input h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#2671FD] placeholder:text-[#93B4F5] focus:outline-none"
                />
                <button type="button" onClick={() => setShowNew((v) => !v)}>
                  {showNew ? <Eye color="#2671FD" /> : <EyeOff color="#2671FD" />}
                </button>
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="login-heading text-[14px] font-semibold text-black">
                {t("confirmNewPassword_label")}
              </span>
              <div className="flex h-[45px] items-center gap-2 rounded-[13px] border border-[#E2E8F0] bg-[#FEFEFD] px-3">
                <Lock className="shrink-0" color="#2671FD" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("confirmNewPassword_placeholder")}
                  className="login-input h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#2671FD] placeholder:text-[#93B4F5] focus:outline-none"
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}>
                  {showConfirm ? <Eye color="#2671FD" /> : <EyeOff color="#2671FD" />}
                </button>
              </div>
            </label>

            <p className="login-text text-[11px] leading-[15px] text-[#6B7280]">
              {t("password_description")}
            </p>
            {error && <p className="text-[12px] text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`login-btn mx-auto h-[52px] w-[230px] max-w-full rounded-[12px] text-[16px] font-bold text-white ${
                loading ? "cursor-not-allowed bg-gray-400" : "bg-[#2563EB]"
              }`}
            >
              {loading ? t("resetting_password") : t("reset_password_button")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
