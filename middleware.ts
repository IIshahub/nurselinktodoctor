import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const locale = request.cookies.get("locale")?.value || "en";
  const response = NextResponse.next();

  if (!request.cookies.get("locale")) {
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
