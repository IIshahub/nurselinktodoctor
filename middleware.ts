import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/src/lib/locale";

export function middleware(request: NextRequest) {
  const localeCookie = request.cookies.get("locale")?.value;
  const locale =
    localeCookie && locales.includes(localeCookie as (typeof locales)[number])
      ? localeCookie
      : defaultLocale;

  const response = NextResponse.next();

  if (!localeCookie) {
    response.cookies.set("locale", locale, {
      path: "/",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
