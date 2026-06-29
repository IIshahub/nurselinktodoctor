"use client";

import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  position?: "middle" | "bottom";
  additional?: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  position = "middle",
  additional,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`w-full max-w-xs rounded-2xl bg-card p-6 shadow-xl ${
          position === "bottom" ? "mt-auto mb-8" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {additional}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-primary py-2 text-sm font-semibold text-white"
        >
          OK
        </button>
      </div>
    </div>
  );
}
