"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Sun, Moon } from "@/src/components/icon";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full transition-colors text-black dark:text-white"
        aria-label="Switch theme"
      >
        <Moon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-full transition-colors text-black dark:text-white"
      aria-label={
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      }
    >
      {theme === "light" ? (
        <Moon className="w-6 h-6" />
      ) : (
        <Sun className="w-6 h-6" />
      )}
    </button>
  );
}
