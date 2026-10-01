"use client";

import LocaleSwitcher from "@/src/components/localeswitcher";
import Logo from "@/src/components/UI/logo";
import { Arrow } from "@/src/components/icon";

export default function AuthHeader({
  showBack = false,
  onBack,
  logo,
}: {
  showBack?: boolean;
  onBack?: () => void;
  logo?: React.ReactNode;
}) {
  return (
    <div className="relative flex justify-center">
      {showBack && (
        <button
          type="button"
          onClick={onBack ?? (() => window.history.back())}
          className="absolute start-0 top-0"
          aria-label="back"
        >
          <Arrow className="h-5 w-5 ltr:rotate-270 rtl:rotate-90" color="#2671FD" />
        </button>
      )}
      {logo ?? <Logo variant="compact" priority />}
      <div className="absolute end-0 top-0">
        <LocaleSwitcher />
      </div>
    </div>
  );
}
