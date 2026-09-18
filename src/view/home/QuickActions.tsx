"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  CaseSummary,
  PreviousPatients,
  Rollcall,
  Schedule,
} from "@/src/components/icon";

const iconColor = "#0D50FF";

export default function QuickActions() {
  const t = useTranslations("settings");

  const items = [
    {
      id: 1,
      title: t("homeQuickActionCaseSummary"),
      icon: <CaseSummary color={iconColor} />,
      route: "/case-summary",
    },
    {
      id: 2,
      title: t("homeQuickActionRollcall"),
      icon: <Rollcall color={iconColor} />,
      route: "/rollcall",
    },
    {
      id: 3,
      title: t("homeQuickActionSchedule"),
      icon: <Schedule color={iconColor} />,
      route: "/scheduling",
    },
    {
      id: 4,
      title: t("homeQuickActionPreviousPatients"),
      icon: <PreviousPatients color={iconColor} />,
      route: "/previous-patients",
    },
  ];

  return (
    <section className="mt-5 w-full">
      <div className="grid w-full grid-cols-2 gap-[10px]">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.route}
            className="flex h-[79px] w-full min-w-0 flex-col items-center justify-center gap-1 rounded-[16px] border border-[#E2E8F0] bg-white transition-transform active:scale-[0.98] dark:border-gray-700 dark:bg-[#2a2a3a]"
          >
            <span className="flex h-6 items-center justify-center [&_svg]:h-6 [&_svg]:w-auto">
              {item.icon}
            </span>
            <span className="text-center text-[12px] font-medium leading-4 text-[#475569] dark:text-gray-300">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
