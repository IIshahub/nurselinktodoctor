"use client";

import Logo from "@/src/components/UI/logo";

export default function EnteringPanel({
  message = "در حال ورود به پروفایل...",
}: {
  message?: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white px-6">
      <Logo variant="compact" priority />
      <div
        className="mt-8 h-10 w-10 animate-spin rounded-full border-[3px] border-[#2563EB] border-t-transparent"
        aria-hidden
      />
      <p className="mt-4 text-center text-[14px] font-medium text-[#2563EB]">
        {message}
      </p>
    </div>
  );
}
