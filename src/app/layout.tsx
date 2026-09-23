import LayoutView from "@/src/view/layout/layout";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nurse Link To Doctor",
  description: "Nurse home-care dashboard — LinkToDoctor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutView>{children}</LayoutView>;
}
