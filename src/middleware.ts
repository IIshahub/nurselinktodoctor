import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/src/lib/locale";

const AUTH_PATHS = ["/authentication", "/login", "/signup", "/reset-password"];

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function withLocale(request: NextRequest, response: NextResponse) {
  const localeCookie = request.cookies.get("locale")?.value;
  const locale =
    localeCookie && locales.includes(localeCookie as (typeof locales)[number])
      ? localeCookie
      : defaultLocale;

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("authToken")?.value;
  const onAuthPage = isAuthPath(pathname);

  if (!token && !onAuthPage) {
    const authUrl = request.nextUrl.clone();
    authUrl.pathname = "/authentication";
    authUrl.search = "";
    return withLocale(request, NextResponse.redirect(authUrl));
  }

  if (token && pathname === "/authentication") {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return withLocale(request, NextResponse.redirect(homeUrl));
  }

  return withLocale(request, NextResponse.next());
}

export const config = {
  matcher: ["/((?!api|backend|_next|_vercel|.*\\..*).*)"],
};
