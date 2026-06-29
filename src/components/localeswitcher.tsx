"use client";

import { useLocale } from "next-intl";
import { setLocale } from "@/src/app/actions/locale";
import { locales, localeNames, type Locale } from "@/src/lib/locale";
import { useTransition, useState, useRef, useEffect } from "react";
import { CheckMark, FlagAr, FlagEn, FlagFa } from "./icon";

const localeFlags: Record<string, React.ReactNode> = {
  en: <FlagEn className="h-5 w-5" />,
  ar: <FlagAr className="h-5 w-5" />,
  fa: <FlagFa className="h-5 w-5" />,
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    startTransition(async () => {
      await setLocale(newLocale);
      window.location.reload();
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition hover:bg-background disabled:opacity-50"
        aria-label="Change language"
      >
        {localeFlags[locale] || "🌐"}
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 min-w-[140px] rounded-lg border border-border bg-card py-1 shadow-lg ltr:right-0 rtl:left-0">
          {locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => handleLocaleChange(loc)}
              className={`flex w-full items-center px-3 py-2 text-left text-sm transition hover:bg-background ${
                loc === locale ? "text-primary" : "text-text"
              }`}
            >
              <span className="shrink-0">{localeFlags[loc]}</span>
              <span className="px-2 font-medium">{localeNames[loc]}</span>
              {loc === locale && (
                <CheckMark className="ml-auto h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
