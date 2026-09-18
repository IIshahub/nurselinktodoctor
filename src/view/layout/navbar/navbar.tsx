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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50"
    >
      <div
        className="app-frame pointer-events-auto px-5 pb-safe"
        suppressHydrationWarning
      >
        <div
          className="rounded-[20px] border border-white/20 bg-white/90 px-1.5 py-1.5 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-[#2a2a3a]/90"
          suppressHydrationWarning
        >
          <div className="flex items-center justify-around gap-0.5">
            {items.map((item) => {
              const isActive =
                pathname === item.slug ||
                (item.slug !== "/" && pathname.startsWith(`${item.slug}/`));

              return (
                <Link
                  key={item.slug}
                  href={item.slug}
                  className={`relative flex flex-col items-center justify-center rounded-xl px-2 py-1 transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isActive
                      ? "text-primary dark:text-blue-400"
                      : "text-gray-700 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.title}
                  suppressHydrationWarning
                >
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-inner dark:from-blue-900/30 dark:to-blue-800/20"
                      suppressHydrationWarning
                    />
                  )}

                  {!isActive && (
                    <div
                      className="absolute inset-0 rounded-xl bg-gray-100/50 opacity-0 transition-opacity duration-200 hover:opacity-100 dark:bg-[#333344]/50"
                      suppressHydrationWarning
                    />
                  )}

                  <div
                    className={`relative z-10 mb-0.5 transition-transform duration-200 ${
                      isActive ? "scale-105" : "scale-100"
                    }`}
                    suppressHydrationWarning
                  >
                    {isActive ? item.iconActive : item.icon}
                  </div>
                  <span
                    className={`relative z-10 text-[10px] leading-none transition-all duration-200 ${
                      isActive
                        ? "font-bold text-primary dark:text-blue-400"
                        : "font-medium"
                    }`}
                  >
                    {item.title}
                  </span>

                  {isActive && (
                    <div
                      className="absolute -top-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary dark:bg-blue-400"
                      suppressHydrationWarning
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
