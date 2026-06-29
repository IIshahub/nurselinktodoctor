"use client";
import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Arrow } from "@/src/components/icon";
import ProfileSection from "./ProfileSection";
import ToggleItems from "./ToggleItems";
import MenuItems from "./MenuItems";
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
  const locale = useLocale();
  const isRTL = locale === "fa" || locale === "ar";
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  const handleLogout = async () => {
    try {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
      const tokenFromCookie = tokenCookie?.split("=")[1];
      const tokenFromStorage = localStorage.getItem("token");
      const token = tokenFromCookie || tokenFromStorage;

      if (!token) {
        clearLocalAuth();
        setToastMessage("خروج انجام شد");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => {
          window.location.href = "/authentication";
        }, 1000);
        return;
      }

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      clearLocalAuth();

      if (response.ok && result.success) {
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
      setToastMessage("خروج انجام شد");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => {
        window.location.href = "/authentication";
      }, 1500);
    }
  };

  const clearLocalAuth = () => {
    const cookiesToClear = ["token", "authToken"];
    cookiesToClear.forEach((cookieName) => {
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=`;
    });

    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      }
    });

    const storageKeysToClear = [
      "token",
      "authToken",
      "refreshToken",
      "tokenExpiration",
      "userEmail",
      "userPhone",
      "userName",
    ];
    storageKeysToClear.forEach((key) => {
      localStorage.removeItem(key);
    });

    localStorage.clear();
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

      <div className="fixed inset-0 z-51 max-w-md w-full mx-auto bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl overflow-y-auto">
        <div className="relative h-20 bg-primaryBG dark:bg-[#2a2a3a] flex items-center px-4">
          <button
            onClick={onClose}
            className={`absolute ${isRTL ? "right-4" : "left-4"} cursor-pointer`}
          >
            <Arrow
              color="black"
              className={`w-6 h-6 dark:text-white ${isRTL ? "rotate-270" : "rotate-90"}`}
            />
          </button>
          <div className="flex-1" />
        </div>

        <ProfileSection image={doctorImage} name={doctorName} />
        <ToggleItems
          toggles={toggles}
          onToggle={onToggle}
          initialLoading={togglesInitialLoading}
          updatingKey={togglesUpdatingKey}
        />
        <MenuItems
          onPrivacyPolicy={() => console.log("Privacy Policy clicked")}
          onHelp={() => console.log("Help clicked")}
          onEmergencySupport={() => console.log("Emergency Support clicked")}
          onLogout={handleLogout}
        />
      </div>
    </>
  );
}
