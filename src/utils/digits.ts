const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function toEnglishDigits(value: string): string {
  return value
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

export function toPersianDigits(
  value: string | number | null | undefined,
): string {
  return String(value ?? "").replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function localizeDigits(
  value: string | number | null | undefined,
  locale: string,
): string {
  const str = String(value ?? "");
  return locale === "fa" ? toPersianDigits(str) : str;
}

export function extractDigits(value: string): string {
  return toEnglishDigits(value).replace(/\D/g, "");
}
