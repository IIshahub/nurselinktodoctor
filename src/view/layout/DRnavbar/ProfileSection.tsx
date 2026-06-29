"use client";
import React from "react";
import { Pen } from "@/src/components/icon";

interface ProfileSectionProps {
  image: string;
  name: string;
}

export default function ProfileSection({ image, name }: ProfileSectionProps) {
  return (
    <div className="flex flex-col items-center py-8 -mt-20 ">
      <div className="relative w-[100px] h-24 mb-4">
        <div
          className="w-full h-full rounded-full bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-primary rounded-full flex items-center justify-center">
          <Pen className="w-5 h-5" color="white" />
        </div>
      </div>
      <div className="text-black dark:text-white text-lg font-semibold">
        {name}
      </div>
    </div>
  );
}
