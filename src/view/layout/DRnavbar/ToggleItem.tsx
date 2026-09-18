"use client";

import React from "react";

interface ToggleItemProps {
  icon: React.ReactNode;
  title: string;
  checked: boolean;
  onChange: () => void;
  isLoading?: boolean;
}

export default function ToggleItem({
  icon,
  title,
  checked,
  onChange,
  isLoading = false,
}: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F1FF] dark:bg-[#2a2a3a]">
          {icon}
        </div>
        <span className="truncate text-[15px] font-medium leading-5 text-[#0F172A] dark:text-white">
          {title}
        </span>
      </div>

      {isLoading ? (
        <div
          className="flex h-7 w-12 items-center justify-center rounded-full bg-[#E2E8F0] dark:bg-gray-700"
          aria-busy="true"
        >
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-[#0D50FF] border-t-transparent"
            aria-hidden
          />
        </div>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={title}
          onClick={onChange}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
            checked ? "bg-[#0D50FF]" : "bg-[#D6E4FF]"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
              checked ? "start-[22px]" : "start-0.5"
            }`}
          />
        </button>
      )}
    </div>
  );
}
