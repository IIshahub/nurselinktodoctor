"use client";

import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { RequestsProvider } from "@/src/contexts/RequestsContext";
import Header from "./DRnavbar/header";
import Navbar from "./navbar/navbar";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
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
