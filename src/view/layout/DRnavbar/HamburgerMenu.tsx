"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Arrow, Moon, Sun } from "@/src/components/icon";
import { useTheme } from "@/src/contexts/ThemeContext";
import LocaleSwitcher from "@/src/components/localeswitcher";
import { API_BASE } from "@/src/lib/api";
import ProfileSection from "./ProfileSection";
import ToggleItems from "./ToggleItems";
import ActionMenuItems, { ProfileMenuItems } from "./MenuItems";
import Toast from "@/src/components/Toast";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  doctorImage: string;
  doctorName: string;
  toggles: {
    online: boolean;
    urgent: boolean;
    notifications: boolean;
  };
  onToggle: (key: "online" | "urgent" | "notifications") => void;
  togglesInitialLoading?: boolean;
  togglesUpdatingKey?: "online" | "urgent" | "notifications" | null;
}

export default function HamburgerMenu({
  isOpen,
  onClose,
  doctorImage,
  doctorName,
  toggles,
  onToggle,
  togglesInitialLoading = false,
  togglesUpdatingKey = null,
}: HamburgerMenuProps) {
  const t = useTranslations("settings");
  const locale = useLocale();
  const isRTL = locale === "fa" || locale === "ar";
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info",
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const clearLocalAuth = () => {
    ["token", "authToken"].forEach((cookieName) => {
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });

    [
      "token",
      "authToken",
      "refreshToken",
      "tokenExpiration",
      "userEmail",
      "userPhone",
      "userName",
    ].forEach((key) => localStorage.removeItem(key));
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
      const token =
        tokenCookie?.split("=")[1] || localStorage.getItem("token");

      if (!token) {
        clearLocalAuth();
        setShowLogoutModal(false);
        setToastMessage("خروج انجام شد");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => {
          window.location.href = "/authentication";
        }, 1000);
        return;
      }

      const response = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json().catch(() => ({}));
      clearLocalAuth();
      setShowLogoutModal(false);

      if (response.ok && (result.success ?? result.isSuccess)) {
        setToastMessage("خروج با موفقیت انجام شد");
        setToastType("success");
      } else {
        setToastMessage("خروج انجام شد (خطا در ارتباط با سرور)");
        setToastType("info");
      }

      setShowToast(true);
      setTimeout(() => {
        window.location.href = "/authentication";
      }, 1500);
    } catch (error) {
      console.error("Logout error:", error);
      clearLocalAuth();
      setShowLogoutModal(false);
      setToastMessage("خروج انجام شد");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => {
        window.location.href = "/authentication";
      }, 1500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="app-frame fixed inset-0 z-[60] mx-auto flex w-full flex-col bg-white dark:bg-[#1a1a1a]">
        <header className="relative flex h-14 shrink-0 items-center px-4 pt-safe">
          <button
            type="button"
            onClick={onClose}
            className="absolute start-4 flex h-10 w-10 items-center justify-center transition-opacity active:opacity-70"
            aria-label="Back"
          >
            <Arrow
              color="#0D50FF"
              className={`h-6 w-6 ${isRTL ? "rotate-270" : "rotate-90"}`}
            />
          </button>

          <h1 className="mx-auto text-[18px] font-semibold leading-6 text-[#0D50FF]">
            {t("myProfile")}
          </h1>

          <div className="absolute end-4 z-10 flex items-center gap-2">
            <LocaleSwitcher />
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center text-[#0D50FF] transition-opacity active:opacity-70"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Moon color="#0D50FF" className="h-[22px] w-[22px]" />
              ) : (
                <Sun color="#0D50FF" className="h-[22px] w-[22px]" />
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          <ProfileSection image={doctorImage} name={doctorName} />

          <div className="mt-6">
            <ProfileMenuItems onNavigate={onClose} />
            <ToggleItems
              toggles={toggles}
              onToggle={onToggle}
              initialLoading={togglesInitialLoading}
              updatingKey={togglesUpdatingKey}
            />
            <ActionMenuItems
              onPrivacyPolicy={() => console.log("Privacy Policy clicked")}
              onHelp={() => console.log("Help clicked")}
              onEmergencySupport={() =>
                console.log("Emergency Support clicked")
              }
              onLogout={() => setShowLogoutModal(true)}
            />
          </div>
        </div>

        {showLogoutModal && (
          <div
            className="absolute inset-0 z-[70] flex items-center justify-center bg-[#0D50FF]/35 px-6 backdrop-blur-[1px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            onClick={() => {
              if (!isLoggingOut) setShowLogoutModal(false);
            }}
          >
            <div
              className="w-full max-w-[320px] rounded-[24px] bg-white px-5 pb-5 pt-6 shadow-xl dark:bg-[#2a2a3a]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                id="logout-modal-title"
                className="text-center text-[22px] font-bold leading-7 text-[#0D50FF]"
              >
                {t("logoutConfirmTitle")}
              </h2>
              <p className="mt-3 text-center text-[14px] font-normal leading-5 text-[#0F172A] dark:text-gray-200">
                {t("logoutConfirmMessage")}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => setShowLogoutModal(false)}
                  className="h-11 rounded-xl border border-[#0D50FF] bg-white text-[14px] font-semibold text-[#0D50FF] transition-opacity active:opacity-80 disabled:opacity-50 dark:bg-transparent"
                >
                  {t("logoutCancel")}
                </button>
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="h-11 rounded-xl bg-[#0D50FF] text-[14px] font-semibold text-white transition-opacity active:opacity-90 disabled:opacity-70"
                >
                  {isLoggingOut ? "..." : t("logoutConfirmYes")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
