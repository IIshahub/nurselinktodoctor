"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { toEnglishDigits, toPersianDigits } from "@/src/utils/digits";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerify: (code: string) => Promise<void>;
}

export default function OTPModal({
  isOpen,
  onClose,
  phoneNumber,
  onVerify,
}: OTPModalProps) {
  const locale = useLocale();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasAutoSubmitted = useRef(false);
  const showPersian = locale === "fa";

  useEffect(() => {
    if (!isOpen) return;
    setOtp(["", "", "", ""]);
    setError("");
    hasAutoSubmitted.current = false;
    const timer = setTimeout(() => inputRefs.current[0]?.focus(), 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const verifyOTP = useCallback(async () => {
    const code = otp.join("");
    if (code.length !== 4) {
      setError("لطفاً کد ۴ رقمی را وارد کنید");
      return;
    }
    if (loading || hasAutoSubmitted.current) return;

    setLoading(true);
    setError("");
    hasAutoSubmitted.current = true;

    try {
      await onVerify(code);
    } catch {
      setError("کد وارد شده صحیح نیست");
      hasAutoSubmitted.current = false;
      setOtp(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  }, [otp, loading, onVerify]);

  useEffect(() => {
    const code = otp.join("");
    if (code.length === 4 && !loading && !hasAutoSubmitted.current && isOpen) {
      const timer = setTimeout(() => {
        void verifyOTP();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [otp, loading, isOpen, verifyOTP]);

  if (!isOpen) return null;

  const displayPhone = showPersian ? toPersianDigits(phoneNumber) : phoneNumber;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal
      >
        <h2 className="mb-2 text-center text-xl font-bold text-black">
          تایید شماره تلفن
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          کد ارسال شده به {displayPhone} را وارد کنید
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void verifyOTP();
          }}
          className="space-y-4"
          dir="ltr"
        >
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={showPersian ? toPersianDigits(digit) : digit}
                onChange={(event) => {
                  const english = toEnglishDigits(event.target.value).replace(
                    /\D/g,
                    "",
                  );
                  if (english.length > 1) return;
                  const next = [...otp];
                  next[index] = english;
                  setOtp(next);
                  setError("");
                  if (english && index < 3) {
                    inputRefs.current[index + 1]?.focus();
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !otp[index] && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                onPaste={(event) => {
                  event.preventDefault();
                  const pasted = toEnglishDigits(
                    event.clipboardData.getData("text"),
                  )
                    .replace(/\D/g, "")
                    .slice(0, 4);
                  const next = ["", "", "", ""];
                  for (let i = 0; i < 4; i++) next[i] = pasted[i] || "";
                  setOtp(next);
                  if (pasted.length === 4) inputRefs.current[3]?.focus();
                }}
                className="h-14 w-14 rounded-lg border-2 border-gray-300 text-center text-2xl font-bold focus:border-[#2563EB] focus:outline-none"
                disabled={loading}
              />
            ))}
          </div>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || otp.join("").length !== 4}
            className={`w-full rounded-lg py-3 font-semibold text-white transition ${
              loading || otp.join("").length !== 4
                ? "cursor-not-allowed bg-gray-400"
                : "bg-[#2563EB] hover:bg-[#1d4ed8]"
            }`}
          >
            {loading ? "در حال بررسی..." : "تایید"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-gray-600"
          >
            انصراف
          </button>
        </form>
      </div>
    </div>
  );
}
