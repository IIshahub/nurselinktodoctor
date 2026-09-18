"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera } from "@/src/components/icon";

interface ProfileSectionProps {
  image: string;
  name: string;
}

export default function ProfileSection({ image, name }: ProfileSectionProps) {
  return (
    <div className="flex flex-col items-center px-6 pb-2 pt-2">
      <div className="relative mb-4 h-[110px] w-[110px]">
        <Image
          src={image}
          alt=""
          width={110}
          height={110}
          className="h-[110px] w-[110px] rounded-full object-cover"
          priority
        />
        <Link
          href="/profile"
          className="absolute bottom-0 left-1/2 flex h-8 w-8 -translate-x-1/2 translate-y-1 items-center justify-center rounded-full bg-[#0D50FF] shadow-sm transition-transform active:scale-95"
          aria-label="Edit profile photo"
        >
          <Camera color="white" size={16} />
        </Link>
      </div>
      <h2 className="text-center text-[20px] font-bold leading-6 text-[#0F172A] dark:text-white">
        {name}
      </h2>
    </div>
  );
}
