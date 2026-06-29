"use client";
import React from "react";
import { useTranslations } from "next-intl";
import MenuItem from "./MenuItem";
import { Lock, Help, Phone, LogoutOutline } from "@/src/components/icon";

interface MenuItemsProps {
  onPrivacyPolicy?: () => void;
  onHelp?: () => void;
  onEmergencySupport?: () => void;
  onLogout?: () => void;
}

export default function MenuItems({
  onPrivacyPolicy,
  onHelp,
  onEmergencySupport,
  onLogout,
}: MenuItemsProps) {
  const t = useTranslations();

  const menuConfigs = [
    {
      key: "privacy",
      icon: <Lock color="#2068FE" className="w-6 h-6" />,
      title: t("privacyPolicy") || "Privacy Policy",
      onClick: onPrivacyPolicy,
      showArrow: true,
    },
    {
      key: "help",
      icon: <Help color="#2068FE" className="w-6 h-6" />,
      title: t("help") || "Help",
      onClick: onHelp,
      showArrow: true,
    },
    {
      key: "emergency",
      icon: <Phone color="#2068FE" className="w-6 h-6" />,
      title: t("emergencySupport") || "Emergency Support",
      onClick: onEmergencySupport,
      showArrow: false,
    },
    {
      key: "logout",
      icon: <LogoutOutline color="#2068FE" className="w-6 h-6" />,
      title: t("logout") || "Logout",
      onClick: onLogout,
      showArrow: false,
    },
  ];

  return (
    <div className="px-4">
      {menuConfigs.map((config) => (
        <MenuItem
          key={config.key}
          icon={config.icon}
          title={config.title}
          onClick={config.onClick}
          showArrow={config.showArrow}
        />
      ))}
    </div>
  );
}
