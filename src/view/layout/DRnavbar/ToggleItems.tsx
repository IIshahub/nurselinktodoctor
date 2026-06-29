"use client";
import React from "react";
import { useTranslations } from "next-intl";
import ToggleItem from "./ToggleItem";
import { Bell, AllHourSupport, OnlineMode } from "@/src/components/icon/icon";

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
  const t = useTranslations();

  const toggleConfigs = [
    {
      key: "online" as const,
      id: "switch-online-status",
      icon: <OnlineMode color="#2068FE" className="w-6 h-6" />,
      title: t("settings.onlineMode"),
      description: t("settings.onlineModeDesc"),
    },
    {
      key: "urgent" as const,
      id: "switch-urgent-booking",
      icon: <AllHourSupport color="#2068FE" className="w-6 h-6" />,
      title: t("settings.urgentBooking"),
      description: t("settings.urgentBookingDesc"),
    },
    {
      key: "notifications" as const,
      id: "switch-notifications",
      icon: <Bell color="#2068FE" className="w-6 h-6" />,
      title: t("settings.receiveNotifications"),
      description: t("settings.receiveNotificationsDesc"),
    },
  ];

  if (initialLoading) {
    return (
      <div className="px-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4">
      {toggleConfigs.map((config) => (
        <ToggleItem
          key={config.key}
          icon={config.icon}
          title={config.title}
          description={config.description}
          checked={toggles[config.key]}
          onChange={() => onToggle(config.key)}
          isLoading={updatingKey === config.key}
        />
      ))}
    </div>
  );
}
