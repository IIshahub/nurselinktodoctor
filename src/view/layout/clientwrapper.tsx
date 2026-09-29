"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { RequestsProvider } from "@/src/contexts/RequestsContext";
import { getAuthToken } from "@/src/lib/session";
import Header from "./DRnavbar/header";
import Navbar from "./navbar/navbar";

const AUTH_ROUTES = new Set(["login", "signup", "reset-password"]);

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  const isAuthRoute = AUTH_ROUTES.has(segment);
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const hasToken = Boolean(getAuthToken());
    setAuthed(hasToken);
    setReady(true);

    if (!hasToken && !isAuthRoute) {
      window.location.replace("/login");
    } else if (hasToken && isAuthRoute) {
      window.location.replace("/");
    }
  }, [isAuthRoute]);

  if (!ready || (isAuthRoute && authed) || (!isAuthRoute && !authed)) {
    return null;
  }

  if (isAuthRoute) {
    return (
      <ThemeProvider>
        <main className="relative z-10">{children}</main>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <RequestsProvider>
        <div className="app-shell">
          <Header />
          <main className="relative z-10 overflow-x-hidden pt-[var(--app-header-offset)] pb-[var(--app-bottom-offset)]">
            {children}
          </main>
          <Navbar />
        </div>
      </RequestsProvider>
    </ThemeProvider>
  );
}
