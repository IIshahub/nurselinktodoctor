import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "@/src/lib/locale";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  let locale = (cookieStore.get("locale")?.value || defaultLocale) as Locale;

  if (!locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
