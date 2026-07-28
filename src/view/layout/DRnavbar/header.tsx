"use client";
import React, { useState, useEffect } from "react";
import { Menu, Pen } from "@/src/components/icon";
import LocaleSwitcher from "@/src/components/localeswitcher";
import Image from "next/image";
import { API_BASE } from "@/src/lib/api";
import useLabConfig from "@/src/view/home/dashboardItem";
import HamburgerMenu from "./HamburgerMenu";
import ThemeToggle from "@/src/components/ThemeToggle";

export default function Header() {
  const { DoctorData } = useLabConfig();
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

        if (token) {
          headers["authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${API_BASE}/doctor-settings/hamburger-menu/get-settings`,
          {
            method: "GET",
            headers,
          }
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
    const newToggles = {
      ...toggles,
      [key]: !toggles[key],
    };

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

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["authorization"] = `Bearer ${token}`;
      }

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
        const errorMessage =
          result.error ||
          result.message ||
          `HTTP ${response.status}: ${response.statusText}`;
        console.error("Settings update failed:", {
          status: response.status,
          result,
          errorMessage,
        });
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      setToggles(previousToggles);
      alert(
        error instanceof Error ? error.message : "خطا در به‌روزرسانی تنظیمات"
      );
    } finally {
      setUpdatingKey(null);
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 max-w-md w-full mx-auto pointer-events-none"
        dir="rtl"
      >
        <div className="px-4 pb-3 pointer-events-auto" suppressHydrationWarning>
          <div
            className="bg-white/90 dark:bg-[#2a2a3a]/90 backdrop-blur-xl rounded-b-3xl pb-3 pt-0 px-4 border-t-0 border-x-0 border-b border-white/20 dark:border-white/10 flex items-center justify-between transition-all duration-300"
            suppressHydrationWarning
          >
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                className="cursor-pointer p-2 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-[#333344] active:scale-95 text-black dark:text-white"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <LocaleSwitcher />
              <ThemeToggle />
            </div>

            <div className="flex justify-center items-center w-full px-2">
              <Image
                src="/assets/logo1.png"
                alt="Logo"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>

            <div className="flex-shrink-0">
              <div className="flex flex-col items-center relative">
                <div className="relative w-[60px] h-[60px] group">
                  <div
                    className="w-full h-full rounded-full bg-cover bg-no-repeat bg-center ring-2 ring-white dark:ring-[#2a2a3a] shadow-lg transition-transform group-hover:scale-105"
                    style={{ backgroundImage: `url(${DoctorData.image})` }}
                  />
                  <button className="absolute bottom-0 right-0 w-[24px] h-[24px] bg-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95">
                    <Pen className="w-4 h-4" color="white" />
                  </button>
                </div>
                <div className="mt-1 text-xs font-semibold text-black dark:text-white text-center whitespace-nowrap">
                  {DoctorData.name}
                </div>
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
