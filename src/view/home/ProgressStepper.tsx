"use client";

import { useTranslations } from "next-intl";
import { CheckMark } from "@/src/components/icon";
import { STEP_COLORS } from "@/src/lib/workflow";
import type { WorkflowStep } from "@/src/types/requests";
import { WORKFLOW_STEPS } from "@/src/types/requests";

interface ProgressStepperProps {
  currentStep: WorkflowStep;
  isCompleted?: boolean;
}

export default function ProgressStepper({
  currentStep,
  isCompleted = false,
}: ProgressStepperProps) {
  const t = useTranslations();
  const currentIndex = WORKFLOW_STEPS.indexOf(currentStep);

  const labels: Record<WorkflowStep, string> = {
    start: t("workflowStart"),
    arrived: t("workflowArrived"),
    left: t("workflowLeft"),
    done: t("workflowDone"),
  };

  return (
    <div className="mb-4 flex w-full justify-center px-1">
      <div className="flex w-full items-start">
        {WORKFLOW_STEPS.map((step, index) => {
          const stepColor = STEP_COLORS[step];
          const isStepCompleted = isCompleted || index < currentIndex;
          const isCurrent = !isCompleted && index === currentIndex;
          const isLast = index === WORKFLOW_STEPS.length - 1;
          const lineColor =
            isCompleted || index < currentIndex
              ? STEP_COLORS[WORKFLOW_STEPS[index + 1]]
              : isCurrent
                ? stepColor
                : "#E2E8F0";

          return (
            <div
              key={step}
              className="relative flex flex-1 flex-col items-center"
            >
              {!isLast && (
                <div
                  className="absolute start-1/2 top-[13px] h-0.5 w-full"
                  style={{ backgroundColor: lineColor }}
                />
              )}

              <div
                className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2"
                style={{
                  borderColor:
                    isStepCompleted || isCurrent ? stepColor : "#D1D5DB",
                  backgroundColor: isStepCompleted ? stepColor : "#FFFFFF",
                }}
              >
                {isStepCompleted ? (
                  <CheckMark className="h-3.5 w-3.5" color="#FFFFFF" />
                ) : (
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: isCurrent ? stepColor : "#D1D5DB",
                    }}
                  />
                )}
              </div>

              <span
                className="mt-1 text-center text-[9px] font-semibold capitalize"
                style={{
                  color: isStepCompleted || isCurrent ? stepColor : "#94A3B8",
                }}
              >
                {labels[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
