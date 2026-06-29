"use client";
import React from "react";
import { Arrow } from "@/src/components/icon";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  showArrow?: boolean;
}

export default function MenuItem({
  icon,
  title,
  onClick,
  showArrow = true,
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#e9f6fe] dark:bg-[#2a2a3a] rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div className="font-medium text-sm text-gray-900 dark:text-white">
          {title}
        </div>
      </div>
      {showArrow && (
        <Arrow color="#2068FE" className="w-5 h-5 ltr:rotate-90 rtl:rotate-270" />
      )}
    </button>
  );
}
