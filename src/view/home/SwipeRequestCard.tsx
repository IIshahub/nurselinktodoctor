"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckApprove, Emergency, Microscope } from "@/src/components/icon";
import type { LabRequest } from "@/src/types/requests";
import SwipeableCard from "./SwipeableCard";

interface SwipeRequestCardProps {
  request: LabRequest;
  showHint?: boolean;
}

export default function SwipeRequestCard({
  request,
  showHint = false,
}: SwipeRequestCardProps) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <SwipeableCard
      showHint={showHint}
      onSwipeAction={() => router.push(`/request/${request.id}`)}
      actionAriaLabel={t("approve")}
      action={
        <>
          <CheckApprove />
          <span className="text-[10px] font-semibold">{t("approve")}</span>
        </>
      }
    >
      <div className="flex overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-1 items-start gap-3 p-3">
          <div className="relative shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/10">
              <Microscope className="h-5 w-5" color="#00BBD3" />
            </div>
            {request.isEmergency && (
              <div className="absolute -right-1 -top-1">
                <Emergency />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-text">
              {request.title}
            </h3>
            <p className="mt-0.5 text-xs text-teal">
              {request.date} - {request.time}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-text/60">
              {request.address}
            </p>
          </div>
        </div>
      </div>
    </SwipeableCard>
  );
}
