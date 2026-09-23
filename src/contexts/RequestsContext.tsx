"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ApiError,
  fetchAllRequests,
  fetchRequestDetail,
  sendWorkflowAction,
} from "@/src/lib/api";
import { formatTimeNow } from "@/src/lib/workflow";
import type {
  CareRequest,
  CareRequestDetail,
  CompletionReport,
  RequestStatus,
  WorkflowStep,
} from "@/src/types/requests";
import { WORKFLOW_STEPS } from "@/src/types/requests";

export const TAB_STORAGE_KEY = "nurselinktodoctor-tab";

// List endpoints expose arrivalStatue; overlay still covers ignore / completion
// report / optimistic step progress between refreshes.
const OVERLAY_STORAGE_KEY = "nurselinktodoctor-overlay";

interface RequestOverlay {
  workflowStep?: WorkflowStep;
  status?: RequestStatus;
  startedAt?: string;
  completedAt?: string;
  completionReport?: CompletionReport;
  nurseComment?: string;
  detail?: CareRequestDetail;
}

interface OverlayState {
  byId: Record<number, RequestOverlay>;
  ignoredIds: number[];
}

const EMPTY_OVERLAY: OverlayState = { byId: {}, ignoredIds: [] };

function loadOverlay(): OverlayState {
  if (typeof window === "undefined") return EMPTY_OVERLAY;
  try {
    const raw = localStorage.getItem(OVERLAY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<OverlayState>;
      return {
        byId: parsed.byId ?? {},
        ignoredIds: parsed.ignoredIds ?? [],
      };
    }
  } catch {
    // ignore corrupted storage
  }
  return EMPTY_OVERLAY;
}

function saveOverlay(overlay: OverlayState) {
  try {
    localStorage.setItem(OVERLAY_STORAGE_KEY, JSON.stringify(overlay));
  } catch {
    // storage unavailable
  }
}

function workflowRank(step?: WorkflowStep) {
  if (!step) return -1;
  return WORKFLOW_STEPS.indexOf(step);
}

const STATUS_RANK: Record<RequestStatus, number> = {
  new: 0,
  approved: 1,
  inProgress: 2,
  completed: 3,
};

function applyOverlay(
  serverRequests: CareRequest[],
  overlay: OverlayState,
): CareRequest[] {
  const ignored = new Set(overlay.ignoredIds);
  return serverRequests
    .filter((request) => !ignored.has(request.id))
    .map((request) => {
      const patch = overlay.byId[request.id];
      if (!patch) return request;

      const merged: CareRequest = { ...request };

      const serverStepRank = workflowRank(request.workflowStep);
      const overlayStepRank = workflowRank(patch.workflowStep);
      if (overlayStepRank > serverStepRank && patch.workflowStep) {
        merged.workflowStep = patch.workflowStep;
      }
      if (
        patch.status &&
        STATUS_RANK[patch.status] > STATUS_RANK[request.status]
      ) {
        merged.status = patch.status;
      }

      if (patch.startedAt) merged.startedAt = patch.startedAt;
      if (patch.completedAt) merged.completedAt = patch.completedAt;
      if (patch.completionReport) merged.completionReport = patch.completionReport;
      if (patch.nurseComment) merged.nurseComment = patch.nurseComment;
      if (patch.detail) {
        merged.detail = { ...merged.detail, ...patch.detail } as CareRequestDetail;
        if (patch.detail.address && patch.detail.address !== "—") {
          merged.address = patch.detail.address;
        }
        if (patch.detail.services && patch.detail.services !== "—") {
          merged.title = patch.detail.services;
        }
      }

      return merged;
    });
}

interface RequestsContextValue {
  requests: CareRequest[];
  isLoading: boolean;
  approveRequest: (id: number, detail?: CareRequestDetail) => Promise<void>;
  ignoreRequest: (id: number) => Promise<void>;
  advanceWorkflow: (id: number) => Promise<CareRequest | undefined>;
  loadRequestDetail: (id: number) => Promise<CareRequestDetail | null>;
  actionError: string | null;
  clearActionError: () => void;
  completeRequest: (
    id: number,
    report: CompletionReport,
    nurseComment?: string,
  ) => Promise<void>;
  getRequestById: (id: number) => CareRequest | undefined;
}

const RequestsContext = createContext<RequestsContextValue | undefined>(undefined);

export function RequestsProvider({ children }: { children: React.ReactNode }) {
  const [serverRequests, setServerRequests] = useState<CareRequest[]>([]);
  const [overlay, setOverlay] = useState<OverlayState>(EMPTY_OVERLAY);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  const requests = useMemo(
    () => applyOverlay(serverRequests, overlay),
    [serverRequests, overlay],
  );

  const requestsRef = React.useRef(requests);
  requestsRef.current = requests;

  const refresh = useCallback(async () => {
    const data = await fetchAllRequests();
    setServerRequests(data);
    return data;
  }, []);

  useEffect(() => {
    setOverlay(loadOverlay());
    refresh()
      .catch((error) => {
        console.error("[requests] failed to load from backend", error);
      })
      .finally(() => setIsLoading(false));
  }, [refresh]);

  const getRequestById = useCallback(
    (id: number) => requests.find((r) => r.id === id),
    [requests],
  );

  const patchOverlay = useCallback((id: number, patch: RequestOverlay) => {
    setOverlay((prev) => {
      const next: OverlayState = {
        ...prev,
        byId: { ...prev.byId, [id]: { ...prev.byId[id], ...patch } },
      };
      saveOverlay(next);
      return next;
    });
  }, []);

  const clearActionError = useCallback(() => setActionError(null), []);

  const loadRequestDetail = useCallback(
    async (id: number): Promise<CareRequestDetail | null> => {
      const current = requestsRef.current.find((r) => r.id === id);
      if (!current) return null;

      try {
        const result = await fetchRequestDetail(current.apiId, current);
        const patch: RequestOverlay = { detail: result.detail };
        if (result.workflowStep) {
          if (current.status !== "new" && current.status !== "completed") {
            patch.workflowStep = result.workflowStep;
            if (result.status) patch.status = result.status;
            if (result.workflowStep !== "start" && !current.startedAt) {
              patch.startedAt = formatTimeNow();
            }
          }
        }
        patchOverlay(id, patch);
        return result.detail;
      } catch (error) {
        console.warn(
          "[requests] failed to load detail",
          error instanceof Error ? error.message : error,
        );
        return current.detail ?? null;
      }
    },
    [patchOverlay],
  );

  const approveRequest = useCallback(
    async (id: number, detail?: CareRequestDetail) => {
      const current = requests.find((r) => r.id === id);
      if (!current) return;

      setActionError(null);
      try {
        await sendWorkflowAction("approve", current.apiId);
      } catch (error) {
        if (!(error instanceof ApiError) || error.status !== 404) {
          setActionError(error instanceof Error ? error.message : "approve failed");
          throw error;
        }
      }

      const patch: RequestOverlay = {
        status: "approved",
        workflowStep: "start",
      };
      if (detail) {
        patch.detail = detail;
      }
      patchOverlay(id, patch);
      await refresh().catch(() => undefined);
    },
    [requests, patchOverlay, refresh],
  );

  const ignoreRequest = useCallback(async (id: number) => {
    setOverlay((prev) => {
      const next: OverlayState = {
        ...prev,
        ignoredIds: [...new Set([...prev.ignoredIds, id])],
      };
      saveOverlay(next);
      return next;
    });
  }, []);

  const advanceWorkflow = useCallback(
    async (id: number) => {
      const current = requests.find((r) => r.id === id);
      if (!current?.workflowStep) return undefined;

      // After "left", completion is a local form — no further API action here.
      if (current.workflowStep === "left" || current.workflowStep === "done") {
        return current;
      }

      const currentIndex = WORKFLOW_STEPS.indexOf(current.workflowStep);
      const nextStep = WORKFLOW_STEPS[currentIndex + 1];
      if (!nextStep || nextStep === "done") return current;

      const action = nextStep === "arrived" ? "arrive" : "leave";

      const patch: RequestOverlay = {
        workflowStep: nextStep,
        status: "inProgress",
      };
      if (current.workflowStep === "start") patch.startedAt = formatTimeNow();

      setActionError(null);
      try {
        await sendWorkflowAction(action, current.apiId);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          patchOverlay(id, patch);
          await refresh().catch(() => undefined);
          return { ...current, ...patch };
        }

        const message = error instanceof Error ? error.message : "workflow failed";
        setActionError(message);
        throw error;
      }

      patchOverlay(id, patch);
      await refresh().catch(() => undefined);
      return { ...current, ...patch };
    },
    [requests, patchOverlay, refresh],
  );

  // No completion-report endpoint yet; leave already finished the visit on
  // the server (or moves it toward completed), so the report is local-only.
  const completeRequest = useCallback(
    async (id: number, report: CompletionReport, nurseComment?: string) => {
      patchOverlay(id, {
        status: "completed",
        workflowStep: "done",
        completionReport: report,
        nurseComment,
        completedAt: formatTimeNow(),
      });
      refresh().catch(() => undefined);
    },
    [patchOverlay, refresh],
  );

  const value = useMemo(
    () => ({
      requests,
      isLoading,
      approveRequest,
      ignoreRequest,
      advanceWorkflow,
      completeRequest,
      getRequestById,
      loadRequestDetail,
      actionError,
      clearActionError,
    }),
    [
      requests,
      isLoading,
      approveRequest,
      ignoreRequest,
      advanceWorkflow,
      completeRequest,
      getRequestById,
      loadRequestDetail,
      actionError,
      clearActionError,
    ],
  );

  return (
    <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (!context) throw new Error("useRequests must be used within RequestsProvider");
  return context;
}
