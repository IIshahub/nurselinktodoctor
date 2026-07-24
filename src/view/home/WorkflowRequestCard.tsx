"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckApprove, Emergency, Microscope } from "@/src/components/icon";
import { STEP_COLORS } from "@/src/lib/workflow";
import type { LabRequest, WorkflowStep } from "@/src/types/requests";

interface WorkflowRequestCardProps {
  request: LabRequest;
  onAction: () => void;
  disabled?: boolean;
}

const actionLabels: Record<WorkflowStep, string> = {
  start: "startAction",
  arrived: "arrivedAction",
  left: "leftAction",
  delivered: "deliveredAction",
  done: "doneAction",
};

export default function WorkflowRequestCard({
  request,
  onAction,
  disabled = false,
}: WorkflowRequestCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const step = request.workflowStep ?? "start";
  const actionKey = actionLabels[step];
  const actionColor = STEP_COLORS[step];

  const handleClick = () => {
    if (disabled) return;
    if (step === "delivered") {
      router.push(`/request/${request.id}/complete`);
      return;
    }
    onAction();
  };

  const subtitle =
    step !== "start" && request.startedAt
      ? `${t("started")} ${request.startedAt}`
      : `${request.date} • ${request.time}`;

  return (
    <div className="flex overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-1 items-start gap-3 p-3">
        <div className="relative shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/10">
            <Microscope className="h-5 w-5" color="#00BBD3" />
          </div>
          {request.isEmergency && step === "delivered" && (
            <div className="absolute -right-1 -top-1">
              <Emergency />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-text">{request.title}</h3>
          <p
            className="mt-0.5 text-xs font-medium"
            style={{ color: step === "start" ? "#00BBD3" : actionColor }}
          >
            {subtitle}
          </p>
          <p className="mt-1 line-clamp-1 text-xs text-text/60">{request.address}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="flex w-14 shrink-0 flex-col items-center justify-center gap-1 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ backgroundColor: actionColor }}
        aria-label={t(actionKey)}
      >
        <CheckApprove />
        <span className="text-[10px] font-semibold capitalize">
          {step === "delivered" ? t("deliveryAction") : t(actionKey)}
        </span>
      </button>
    </div>
  );
}
