"use client";

import { useLocale } from "next-intl";
import { localizeDigits, toEnglishDigits } from "@/src/utils/digits";

export function useLocalizedDigits() {
  const locale = useLocale();

  return {
    locale,
    display: (value: string | number | null | undefined) =>
      localizeDigits(value, locale),
    parse: toEnglishDigits,
  };
}
