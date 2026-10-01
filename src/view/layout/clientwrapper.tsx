"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { RequestsProvider } from "@/src/contexts/RequestsContext";
import { getAuthToken } from "@/src/lib/session";
import Header from "./DRnavbar/header";
import Navbar from "./navbar/navbar";

const AUTH_ROUTES = new Set([
  "authentication",
  "login",
  "signup",
  "reset-password",
]);

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
  const [redirectHome, setRedirectHome] = useState(false);

  useEffect(() => {
    const hasToken = Boolean(getAuthToken());
    setAuthed(hasToken);
    setReady(true);

    const hasCookie = document.cookie
      .split("; ")
      .some((row) => row.startsWith("token=") && row.slice("token=".length));

    if (!hasToken && !isAuthRoute) {
      window.location.replace("/authentication");
    } else if (hasCookie && segment === "authentication") {
      setRedirectHome(true);
      window.location.replace("/");
    }
  }, [isAuthRoute]);

  if (!ready || redirectHome || (!isAuthRoute && !authed)) {
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
