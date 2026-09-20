"use client";

import React from "react";
import { useTranslations } from "next-intl";
import MenuItem from "./MenuItem";
import {
  Lock,
  Help,
  EmergencySupport,
  LogoutOutline,
  PersonalInformation,
  ProfessionalInformation,
} from "@/src/components/icon";

interface ProfileMenuItemsProps {
  onNavigate?: () => void;
}

export function ProfileMenuItems({ onNavigate }: ProfileMenuItemsProps) {
  const t = useTranslations();
  const tSettings = useTranslations("settings");

  const items = [
    {
      key: "professional",
      icon: <ProfessionalInformation color="#0D50FF" className="h-6 w-6" />,
      title: tSettings("professionalProfile"),
      href: "/profile",
    },
    {
      key: "personal",
      icon: <PersonalInformation color="#0D50FF" className="h-6 w-6" />,
      title: t("personal_info"),
      href: "/profile",
    },
  ];

  return (
    <div>
      {items.map((item) => (
        <MenuItem
          key={item.key}
          icon={item.icon}
          title={item.title}
          href={item.href}
          onClick={onNavigate}
          showArrow
        />
      ))}
    </div>
  );
}

interface ActionMenuItemsProps {
  onPrivacyPolicy?: () => void;
  onHelp?: () => void;
  onEmergencySupport?: () => void;
  onLogout?: () => void;
}

export default function ActionMenuItems({
  onPrivacyPolicy,
  onHelp,
  onEmergencySupport,
  onLogout,
}: ActionMenuItemsProps) {
  const t = useTranslations();

  return (
    <div>
      <MenuItem
        icon={<Lock color="#0D50FF" className="h-6 w-6" />}
        title={t("privacyPolicy") || "Privacy Policy"}
        onClick={onPrivacyPolicy}
        showArrow
      />
      <MenuItem
        icon={<Help color="#0D50FF" className="h-6 w-6" />}
        title={t("help") || "Help"}
        onClick={onHelp}
        showArrow
      />
      <MenuItem
        icon={<EmergencySupport color="#0D50FF" className="h-6 w-6" />}
        title={t("emergencySupport") || "Emergency Support"}
        onClick={onEmergencySupport}
        showArrow
      />
      <MenuItem
        icon={<LogoutOutline color="#0D50FF" className="h-6 w-6" />}
        title={t("logout") || "Logout"}
        onClick={onLogout}
        showArrow={false}
      />
    </div>
  );
}
