"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "@/src/components/icon";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  href?: string;
  showArrow?: boolean;
  iconBgClassName?: string;
}

export default function MenuItem({
  icon,
  title,
  onClick,
  href,
  showArrow = true,
  iconBgClassName = "bg-[#E8F1FF] dark:bg-[#2a2a3a]",
}: MenuItemProps) {
  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3.5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBgClassName}`}
        >
          {icon}
        </div>
        <span className="truncate text-[15px] font-medium leading-5 text-[#0F172A] dark:text-white">
          {title}
        </span>
      </div>
      {showArrow && (
        <ChevronRight
          color="#CBD5E1"
          size={20}
          className="shrink-0 rtl:rotate-180"
        />
      )}
    </>
  );

  const className =
    "flex w-full items-center justify-between py-3.5 transition-opacity active:opacity-70";

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
