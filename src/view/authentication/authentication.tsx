"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import AuthLogo from "./AuthLogo";

export default function AuthenticationView() {
  const t = useTranslations();

  return (
    <div className="auth-page z-10 flex w-full justify-center bg-white">
      <div className="auth-frame flex h-full w-full max-w-[390px] flex-col items-center overflow-hidden px-6 pt-safe pb-safe">
        <div className="min-h-0 flex-[2.42] basis-0" />

        <AuthLogo />

        <p className="auth-description mt-[clamp(12px,4vh,32px)] min-h-[86px] w-full max-w-[290px] shrink-0 whitespace-pre-line text-center text-[14px] font-normal leading-[20px] text-black">
          {t("auth_description")}
        </p>

        <div className="min-h-0 flex-[1] basis-0" />

        <div className="flex w-full shrink-0 flex-col items-center gap-[clamp(12px,3.5vh,30px)]">
          <Link
            href="/login"
            className="auth-btn flex h-[52px] w-[242px] max-w-full items-center justify-center rounded-[12px] border border-[#2563EB] bg-[#2563EB] text-[16px] font-medium text-white transition-all duration-300 ease-out hover:bg-[#1d4ed8] active:scale-[0.98]"
          >
            {t("login_button")}
          </Link>

          <Link
            href="/signup"
            className="auth-btn flex h-[52px] w-[242px] max-w-full items-center justify-center rounded-[12px] border border-[#2563EB] bg-white text-[16px] font-medium text-[#2563EB] transition-all duration-300 ease-out hover:bg-[#eff6ff] active:scale-[0.98]"
          >
            {t("register_as_nurse")}
          </Link>
        </div>

        <div className="min-h-0 flex-[2.42] basis-0" />
      </div>
    </div>
  );
}
