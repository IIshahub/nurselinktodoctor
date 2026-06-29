export const locales = ["en", "fa", "ar"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  fa: "فارسی",
  ar: "العربی",
};
