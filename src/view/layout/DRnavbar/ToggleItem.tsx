"use client";
import React from "react";

interface ToggleItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  isLoading?: boolean;
}

export default function ToggleItem({
  icon,
  title,
  description,
  checked,
  onChange,
  isLoading = false,
}: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#e9f6fe] dark:bg-[#2a2a3a] rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="font-medium text-sm text-gray-900 dark:text-white">
            {title}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {description}
          </div>
        </div>
      </div>
      {isLoading ? (
        <div
          className="w-11 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
          aria-busy="true"
        >
          <span
            className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
            aria-hidden
          />
        </div>
      ) : (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
          />
          <div
            className={`w-11 h-6 rounded-full relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 dark:border-gray-600 after:rounded-full after:h-5 after:w-5 after:transition-all ${
              checked
                ? "bg-blue-600 after:translate-x-full"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          ></div>
        </label>
      )}
    </div>
  );
}
