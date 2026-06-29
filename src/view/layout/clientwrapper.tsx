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
        <Header />
        <main className="relative z-10 mx-auto w-full max-w-md bg-background pt-[105px] pb-24">
          {children}
        </main>
        <Navbar />
      </RequestsProvider>
    </ThemeProvider>
  );
}
