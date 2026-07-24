"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Toast from "@/src/components/Toast";
import { TAB_STORAGE_KEY, useRequests } from "@/src/contexts/RequestsContext";
import type { RequestStatus } from "@/src/types/requests";
import CompletedRequestCard from "./CompletedRequestCard";
import ProgressStepper from "./ProgressStepper";
import SwipeRequestCard from "./SwipeRequestCard";
import WorkflowRequestCard from "./WorkflowRequestCard";

const tabs: RequestStatus[] = ["new", "approved", "inProgress", "completed"];

export default function RequestTabs() {
  const t = useTranslations();
  const { requests, advanceWorkflow, isLoading, actionError, clearActionError } =
    useRequests();
  const [activeTab, setActiveTab] = useState<RequestStatus>("new");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(TAB_STORAGE_KEY) as RequestStatus | null;
      if (stored && tabs.includes(stored)) {
        sessionStorage.removeItem(TAB_STORAGE_KEY);
        setActiveTab(stored);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const tabLabels: Record<RequestStatus, string> = {
    new: t("tabNew"),
    approved: t("tabApproved"),
    inProgress: t("tabInProgress"),
    completed: t("tabCompleted"),
  };

  const filtered = requests.filter((request) => {
    if (activeTab === "approved") {
      return request.status === "approved" && request.workflowStep === "start";
    }
    return request.status === activeTab;
  });

  const stepperRequest = filtered.find((r) => r.workflowStep);

  const showStepper =
    !!stepperRequest?.workflowStep &&
    (activeTab === "approved" || activeTab === "inProgress" || activeTab === "completed");

  const handleWorkflowAction = async (requestId: number) => {
    setActionLoadingId(requestId);
    try {
      await advanceWorkflow(requestId);
      setActiveTab("inProgress");
    } catch {
      // actionError is set in context; toast renders below.
    } finally {
      setActionLoadingId(null);
    }
  };

  const runWorkflowAction = (requestId: number) => {
    if (actionLoadingId !== null) return;
    void handleWorkflowAction(requestId);
  };

  const showLoader = isLoading && filtered.length === 0 && activeTab !== "new";

  return (
    <section className="mt-6 px-4">
      {actionError && (
        <Toast
          message={actionError}
          type="error"
          onClose={clearActionError}
        />
      )}
      {showStepper && stepperRequest?.workflowStep && (
        <ProgressStepper
          currentStep={stepperRequest.workflowStep}
          isCompleted={stepperRequest.status === "completed"}
        />
      )}

      <div className="flex gap-1 rounded-2xl bg-card p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition ${
              activeTab === tab
                ? "bg-[#E1F5FE] text-primary"
                : "text-text/50 hover:text-text"
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className="scrollbar-thin mt-4 max-h-[320px] space-y-3 overflow-y-auto pr-1">
        {showLoader ? (
          <div className="flex justify-center py-10">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((request) => {
            if (activeTab === "new") {
              return <SwipeRequestCard key={request.id} request={request} />;
            }
            if (activeTab === "completed") {
              return <CompletedRequestCard key={request.id} request={request} />;
            }
            return (
              <WorkflowRequestCard
                key={request.id}
                request={request}
                onAction={() => {
                  if (request.workflowStep === "start") {
                    runWorkflowAction(request.id);
                    return;
                  }
                  runWorkflowAction(request.id);
                }}
                disabled={actionLoadingId === request.id}
              />
            );
          })
        ) : (
          <div className="rounded-2xl border border-border bg-card py-10 text-center text-sm text-text/50">
            {t("noRequests")}
          </div>
        )}
      </div>
    </section>
  );
}
