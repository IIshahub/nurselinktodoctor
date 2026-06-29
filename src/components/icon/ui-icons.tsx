"use client";

import type { JSX } from "react";

interface Gate {
  className?: string;
  color?: string;
}

export const CheckMark = ({ className, color = "currentColor" }: Gate): JSX.Element => (
  <svg className={className} fill={color} viewBox="0 0 20 20" aria-hidden>
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);
