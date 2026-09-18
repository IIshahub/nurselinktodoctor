import Image from "next/image";
import React from "react";

const MARK = { src: "/assets/logo-mark.png", width: 116, height: 136 };
const WORDMARK = { src: "/assets/logo-wordmark.png", width: 197, height: 42 };

const HEADER_MARK_W = 24;
const HEADER_MARK_H = 28;
const HEADER_WORDMARK_W = 82;

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export default function Logo({ className = "", priority = false }: LogoProps) {
  return (
    <div
      className={`flex items-center justify-center gap-1 ${className}`}
      style={{ width: "110px", height: "28px" }}
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
