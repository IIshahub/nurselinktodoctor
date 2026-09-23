"use client";

import React from "react";
import { useTranslations } from "next-intl";
import useNurseConfig from "./dashboardItem";
import StatsSection from "./StatsSection";
import QuickActions from "./QuickActions";
import RequestTabs from "./RequestTabs";

export default function HomeView() {
  const t = useTranslations();
  const { StatsData } = useNurseConfig();

  return (
    <div className="home-page relative mx-auto w-full overflow-x-hidden pb-6">
      <StatsSection title={t("todaysStatistics")} stats={StatsData} />

      <div className="px-[26px]">
        <QuickActions />
      </div>

      <RequestTabs />
    </div>
  );
}
