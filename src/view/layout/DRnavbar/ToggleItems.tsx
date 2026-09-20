"use client";

import React from "react";
import { useTranslations } from "next-intl";
import ToggleItem from "./ToggleItem";
import { Notifications, AllHourSupport, OnlineMode } from "@/src/components/icon";

interface ToggleItemsProps {
  toggles: {
    online: boolean;
    urgent: boolean;
    notifications: boolean;
  };
  onToggle: (key: "online" | "urgent" | "notifications") => void;
  initialLoading?: boolean;
  updatingKey?: "online" | "urgent" | "notifications" | null;
}

export default function ToggleItems({
  toggles,
  onToggle,
  initialLoading = false,
  updatingKey = null,
}: ToggleItemsProps) {
  const t = useTranslations("settings");

  const toggleConfigs = [
    {
      key: "online" as const,
      icon: <OnlineMode color="#0D50FF" className="h-6 w-6" />,
      title: t("onlineMode"),
    },
    {
      key: "urgent" as const,
      icon: <AllHourSupport color="#0D50FF" className="h-6 w-6" />,
      title: t("urgentBooking"),
    },
    {
      key: "notifications" as const,
      icon: <Notifications color="#0D50FF" className="h-6 w-6" />,
      title: t("receiveNotifications"),
    },
  ];

  if (initialLoading) {
    return (
      <div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex animate-pulse items-center justify-between py-3.5"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="h-7 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {toggleConfigs.map((config) => (
        <ToggleItem
          key={config.key}
          icon={config.icon}
          title={config.title}
          checked={toggles[config.key]}
          onChange={() => onToggle(config.key)}
          isLoading={updatingKey === config.key}
        />
      ))}
    </div>
  );
}
