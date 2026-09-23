"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckApprove, Emergency, NurseCare } from "@/src/components/icon";
import { STEP_COLORS } from "@/src/lib/workflow";
import type { CareRequest, WorkflowStep } from "@/src/types/requests";
import SwipeableCard from "./SwipeableCard";

interface WorkflowRequestCardProps {
  request: CareRequest;
  onAction: () => void | Promise<void>;
  disabled?: boolean;
  showHint?: boolean;
}

const actionLabels: Record<WorkflowStep, string> = {
  start: "startAction",
  arrived: "arrivedAction",
  left: "completeVisitAction",
  done: "doneAction",
};

export default function WorkflowRequestCard({
  request,
  onAction,
  disabled = false,
  showHint = false,
}: WorkflowRequestCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const step = request.workflowStep ?? "start";
  const actionKey = actionLabels[step];
  const actionColor = STEP_COLORS[step];
  const label = t(actionKey);

  const handleAction = async () => {
    if (disabled) return;
    // After leave, open the local completion form (API has no deliver step).
    if (step === "left") {
      router.push(`/request/${request.id}/complete`);
      return;
    }
    await onAction();
  };

  const subtitle =
    step !== "start" && request.startedAt
      ? `${t("started")} ${request.startedAt}`
      : `${request.date} • ${request.time}`;

  return (
    <SwipeableCard
      showHint={showHint}
      disabled={disabled}
      onSwipeAction={handleAction}
      actionAriaLabel={label}
      actionClassName=""
      actionStyle={{ backgroundColor: actionColor }}
      action={
        <>
          <CheckApprove />
          <span className="text-[10px] font-semibold capitalize">{label}</span>
        </>
      }
    >
      <div className="flex overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-1 items-start gap-3 p-3">
          <div className="relative shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/10">
              <NurseCare className="h-5 w-5" color="#00BBD3" />
            </div>
            {request.isEmergency && step === "left" && (
              <div className="absolute -right-1 -top-1">
                <Emergency />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-text">
              {request.title}
            </h3>
            <p
              className="mt-0.5 text-xs font-medium"
              style={{ color: step === "start" ? "#00BBD3" : actionColor }}
            >
              {subtitle}
            </p>
            {request.address !== "—" && (
              <p className="mt-1 line-clamp-1 text-xs text-text/60">
                {request.address}
              </p>
            )}
          </div>
        </div>
      </div>
    </SwipeableCard>
  );
}
