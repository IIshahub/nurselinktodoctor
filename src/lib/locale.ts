export const locales = ["fa", "en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";

export const localeNames: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
  ar: "العربی",
};
