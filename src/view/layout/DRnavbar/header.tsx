"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Bell, Menu, Pen } from "@/src/components/icon";
import { API_BASE } from "@/src/lib/api";
import useNurseConfig from "@/src/view/home/dashboardItem";
import { useRequests } from "@/src/contexts/RequestsContext";
import HamburgerMenu from "./HamburgerMenu";
import Logo from "@/src/components/UI/logo";

export default function Header() {
  const t = useTranslations("settings");
  const { DoctorData } = useNurseConfig();
  const { requests } = useRequests();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toggles, setToggles] = useState({
    online: false,
    urgent: true,
    notifications: true,
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<
    "online" | "urgent" | "notifications" | null
  >(null);

  const pendingRequests = requests.filter((r) => r.status === "new").length;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") ||
              localStorage.getItem("authToken") ||
              document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1]
            : null;

        const headers: HeadersInit = {};
        if (token) headers.authorization = `Bearer ${token}`;

        const response = await fetch(
          `${API_BASE}/doctor-settings/hamburger-menu/get-settings`,
          {
            method: "GET",
            headers,
          },
        );

        if (response.ok) {
          const result = await response.json();
          const raw = result.data?.data ?? result.data ?? {};
          const toBool = (v: unknown) => v === true || v === "true" || v === 1;
          setToggles({
            online: toBool(raw.isOnline),
            urgent: toBool(raw.emergencyReservationEnabled),
            notifications: toBool(raw.notificationEnabled),
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = async (key: "online" | "urgent" | "notifications") => {
    const previousToggles = { ...toggles };
    const newToggles = { ...toggles, [key]: !toggles[key] };

    setToggles(newToggles);
    setUpdatingKey(key);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") ||
            localStorage.getItem("authToken") ||
            document.cookie
              .split("; ")
              .find((row) => row.startsWith("token="))
              ?.split("=")[1]
          : null;

      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers.authorization = `Bearer ${token}`;

      const apiByKey = {
        online: `${API_BASE}/doctor-settings/hamburger-menu/setting-is-online`,
        urgent: `${API_BASE}/doctor-settings/hamburger-menu/setting-emergency-reservation`,
        notifications: `${API_BASE}/doctor-settings/hamburger-menu/setting-notification`,
      } as const;

      const response = await fetch(apiByKey[key], {
        method: "PUT",
        headers,
        body: JSON.stringify(newToggles[key]),
      });

      const result = await response.json();
      const isSuccess = result.success ?? result.isSuccess;

      if (!response.ok || !isSuccess) {
        throw new Error(
          result.error ||
            result.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      setToggles(previousToggles);
      alert(
        error instanceof Error ? error.message : "خطا در به‌روزرسانی تنظیمات",
      );
    } finally {
      setUpdatingKey(null);
    }
  };

  const displayName =
    DoctorData.name.replace(/^دکتر\s*/i, "").replace(/^Dr\.?\s*/i, "") ||
    DoctorData.name;

  return (
    <>
      <header className="app-header app-frame pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="pointer-events-auto bg-white px-4 pt-safe shadow-[0px_1px_3px_0px_#00000040] dark:bg-[#1a1a1a]">
          <div className="flex justify-center py-3">
            <Logo priority />
          </div>

          <div className="flex h-[49px] items-center justify-between gap-2 pb-3">
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                className="flex cursor-pointer items-center justify-center p-2 text-black transition-all active:scale-95 dark:text-white"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" color="currentColor" />
              </button>
              <Link
                href="/"
                className="flex items-center justify-center p-2 transition-opacity hover:opacity-80 active:scale-95"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" color="#0D50FF" />
              </Link>
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
              <div className="min-w-0">
                <p className="truncate text-end text-[14px] font-bold leading-[17px] text-black dark:text-white">
                  <span aria-hidden>👋 </span>
                  {t("homeGreeting", { name: displayName })}
                </p>
                <p className="mt-0.5 line-clamp-2 text-end text-[11px] font-normal leading-[14px] text-[#5B8DEF]">
                  {t("homeNewRequests", { count: pendingRequests })}
                </p>
              </div>

              <div className="relative h-[49px] w-[49px] shrink-0">
                <Image
                  src={DoctorData.image}
                  alt=""
                  width={49}
                  height={49}
                  className="h-[49px] w-[49px] rounded-full object-cover ring-2 ring-white dark:ring-[#1a1a1a]"
                />
                <Link
                  href="/profile"
                  className="absolute bottom-0 end-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#0D50FF] shadow-sm transition-transform active:scale-95"
                  aria-label="Edit profile"
                >
                  <Pen className="h-2.5 w-2.5" color="white" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        doctorImage={DoctorData.image}
        doctorName={DoctorData.name}
        toggles={toggles}
        onToggle={handleToggle}
        togglesInitialLoading={settingsLoading}
        togglesUpdatingKey={updatingKey}
      />
    </>
  );
}
