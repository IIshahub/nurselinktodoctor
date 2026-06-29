"use client";

import { useTranslations } from "next-intl";
import { CheckMark, Microscope } from "@/src/components/icon";
import { STEP_COLORS } from "@/src/lib/workflow";
import type { LabRequest } from "@/src/types/requests";

interface CompletedRequestCardProps {
  request: LabRequest;
}

export default function CompletedRequestCard({
  request,
}: CompletedRequestCardProps) {
  const t = useTranslations();

  return (
    <div className="flex overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-1 items-start gap-3 p-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal/10">
          <Microscope className="h-5 w-5" color="#00BBD3" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-text">{request.title}</h3>
          <p className="mt-0.5 text-xs font-medium text-teal">{t("completedLabel")}</p>
          <div className="mt-1 flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-primary">{request.date}</span>
            <span className="font-semibold text-primary">{request.time}</span>
          </div>
        </div>
      </div>

      <div
        className="flex w-14 shrink-0 flex-col items-center justify-center gap-1 text-white"
        style={{ backgroundColor: STEP_COLORS.done }}
      >
        <CheckMark className="h-4 w-4" color="#FFFFFF" />
        <span className="text-[10px] font-semibold">{t("completedLabel")}</span>
      </div>
    </div>
  );
}
