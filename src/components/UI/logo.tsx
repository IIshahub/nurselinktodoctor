import Image from "next/image";
import React from "react";

const MARK = { src: "/assets/logo-mark.png", width: 116, height: 136 };
const WORDMARK = { src: "/assets/logo-wordmark.png", width: 197, height: 42 };

const HEADER_MARK_W = 24;
const HEADER_MARK_H = 28;
const HEADER_WORDMARK_W = 82;

const VARIANTS = {
  splash: {
    boxWidth: "min(242px, 40dvh)",
    boxHeight: "auto",
    mark: 124 / 242,
    gap: "0",
  },
  compact: {
    boxWidth: "min(146px, 17.3dvh)",
    boxHeight: "min(114.1537px, 13.53dvh)",
    mark: 46 / 146,
    gap: "8px",
  },
  header: {
    boxWidth: "110px",
    boxHeight: "28px",
    mark: 0,
    gap: "0",
  },
} as const;

type LogoProps = {
  variant?: keyof typeof VARIANTS;
  className?: string;
  priority?: boolean;
};

export default function Logo({
  variant = "header",
  className = "",
  priority = false,
}: LogoProps) {
  const v = VARIANTS[variant];

  if (variant === "header") {
    return (
      <div
        className={`flex items-center justify-center gap-1 ${className}`}
        style={{ width: v.boxWidth, height: v.boxHeight }}
      >
        <Image
          {...MARK}
          alt=""
          sizes={`${HEADER_MARK_W}px`}
          priority={priority}
          quality={100}
          className="shrink-0"
          style={{
            width: `${HEADER_MARK_W}px`,
            height: `${HEADER_MARK_H}px`,
          }}
        />
        <Image
          {...WORDMARK}
          alt="linkToDoctor"
          sizes={`${HEADER_WORDMARK_W}px`}
          priority={priority}
          quality={100}
          className="shrink-0"
          style={{
            width: `${HEADER_WORDMARK_W}px`,
            height: "auto",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      style={{
        width: v.boxWidth,
        maxWidth: "100%",
        height: v.boxHeight,
      }}
    >
      <Image
        {...MARK}
        alt=""
        sizes="124px"
        priority={priority}
        style={{ width: `${(v.mark * 100).toFixed(3)}%`, height: "auto" }}
      />
      <Image
        {...WORDMARK}
        alt="linkToDoctor"
        sizes="242px"
        priority={priority}
        style={{ width: "100%", height: "auto", marginTop: v.gap }}
      />
    </div>
  );
}
