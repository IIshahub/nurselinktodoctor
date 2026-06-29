"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Grid from "@/src/components/grid";
import useLabConfig from "./dashboardItem";
import StatsSection from "./StatsSection";
import RequestTabs from "./RequestTabs";

const GRID_ITEM_CLASS =
  "border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-[#2a2a3a] shadow-none";

export default function HomeView() {
  const t = useTranslations();
  const { MenuItems, StatsData } = useLabConfig();

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-background pb-6 dark:bg-[#1a1a1a]">
      <StatsSection title={t("todaysStatistics")} stats={StatsData} />

      <div className="mb-8 w-full px-4">
        <div className="h-0.5 bg-[#2068FE]" />
      </div>

      <Grid data={MenuItems} cols={2} additionalcss={GRID_ITEM_CLASS} />

      <RequestTabs />
    </div>
  );
}
