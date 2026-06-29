"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Locale } from "@/src/lib/locale";

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();

  cookieStore.set("locale", locale, {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  revalidatePath("/", "layout");
}
