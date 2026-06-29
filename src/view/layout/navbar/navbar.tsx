"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarItem from "./navbaritem";

export default function Navbar() {
  const items = NavbarItem();
  const pathname = usePathname();

  return (
    <nav
      role="navigation"
      aria-label="Bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-md"
    >
      <div className="px-4 pb-safe">
        <div className="rounded-3xl border border-border bg-card/95 px-2 py-3 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-around gap-1">
            {items.map((item) => {
              const isActive =
                pathname === item.slug ||
                (item.slug !== "/" && pathname.startsWith(item.slug));

              return (
                <Link
                  key={item.slug}
                  href={item.slug}
                  className={`relative flex flex-col items-center justify-center rounded-xl px-3 py-2 transition-all ${
                    isActive
                      ? "text-primary"
                      : "text-text/60 hover:text-primary"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-primary/10" />
                  )}
                  <div className="relative z-10 mb-1">
                    {isActive ? item.iconActive : item.icon}
                  </div>
                  <span
                    className={`relative z-10 text-[10px] capitalize ${
                      isActive ? "font-bold" : "font-medium"
                    }`}
                  >
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
