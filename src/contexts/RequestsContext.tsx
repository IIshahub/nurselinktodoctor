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
  CompletionReport,
  LabRequest,
  LabRequestDetail,
  RequestStatus,
  WorkflowStep,
} from "@/src/types/requests";
import { WORKFLOW_STEPS } from "@/src/types/requests";

export const TAB_STORAGE_KEY = "lablinktodoctor-tab";

// List endpoints don't report the current workflow step. Detail endpoints
// expose arrivalStatue; until that is applied we keep a local overlay for
// ignore / completion report / intermediate step progress.
const OVERLAY_STORAGE_KEY = "lablinktodoctor-overlay";

interface RequestOverlay {
  workflowStep?: WorkflowStep;
  status?: RequestStatus;
  startedAt?: string;
  completedAt?: string;
  completionReport?: CompletionReport;
  collectorComment?: string;
  detail?: LabRequestDetail;
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
  serverRequests: LabRequest[],
  overlay: OverlayState,
): LabRequest[] {
  const ignored = new Set(overlay.ignoredIds);
  return serverRequests
    .filter((request) => !ignored.has(request.id))
    .map((request) => {
      const patch = overlay.byId[request.id];
      if (!patch) return request;

      const merged: LabRequest = { ...request };

      // Prefer the further-along workflow/status so a stale local overlay
      // cannot roll the UI back behind the backend arrivalStatue.
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
      if (patch.collectorComment) merged.collectorComment = patch.collectorComment;
      // Prefer API detail (patient name etc.) over placeholder list detail.
      if (patch.detail?.patientName && patch.detail.patientName !== "—") {
        merged.detail = patch.detail;
        merged.address = patch.detail.address || merged.address;
      } else if (!merged.detail && patch.detail) {
        merged.detail = patch.detail;
      }

      return merged;
    });
}

interface RequestsContextValue {
  requests: LabRequest[];
  isLoading: boolean;
  approveRequest: (id: number, detail?: LabRequestDetail) => Promise<void>;
  ignoreRequest: (id: number) => Promise<void>;
  advanceWorkflow: (id: number) => Promise<LabRequest | undefined>;
  loadRequestDetail: (id: number) => Promise<LabRequestDetail | null>;
  actionError: string | null;
  clearActionError: () => void;
  completeRequest: (
    id: number,
    report: CompletionReport,
    collectorComment?: string,
  ) => Promise<void>;
  getRequestById: (id: number) => LabRequest | undefined;
}

const RequestsContext = createContext<RequestsContextValue | undefined>(undefined);

export function RequestsProvider({ children }: { children: React.ReactNode }) {
  const [serverRequests, setServerRequests] = useState<LabRequest[]>([]);
  const [overlay, setOverlay] = useState<OverlayState>(EMPTY_OVERLAY);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  const requests = useMemo(
    () => applyOverlay(serverRequests, overlay),
    [serverRequests, overlay],
  );

  // Keep a stable snapshot for callbacks so they don't recreate on every
  // overlay/list update (which previously caused an infinite detail-fetch loop).
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
    async (id: number): Promise<LabRequestDetail | null> => {
      const current = requestsRef.current.find((r) => r.id === id);
      if (!current) return null;

      try {
        const result = await fetchRequestDetail(
          current.requestType,
          current.apiId,
        );
        const patch: RequestOverlay = { detail: result.detail };
        if (result.workflowStep) {
          // Prefer backend arrivalStatue over stale local overlay for confirmed items.
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
        console.error("[requests] failed to load detail", error);
        return current.detail ?? null;
      }
    },
    [patchOverlay],
  );

  const approveRequest = useCallback(
    async (id: number, detail?: LabRequestDetail) => {
      const current = requests.find((r) => r.id === id);
      if (!current) return;

      setActionError(null);
      try {
        await sendWorkflowAction(current.requestType, "approve", current.apiId);
      } catch (error) {
        // Request may already be approved on the backend while the UI still
        // shows it as new (e.g. after a refresh or stale local overlay).
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

  // No backend endpoint for ignoring yet: hide the request locally.
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

      const currentIndex = WORKFLOW_STEPS.indexOf(current.workflowStep);
      const nextStep = WORKFLOW_STEPS[currentIndex + 1];
      if (!nextStep || current.workflowStep === "delivered") return current;

      const action =
        nextStep === "arrived"
          ? "arrive"
          : nextStep === "left"
            ? "leave"
            : "deliver";

      const patch: RequestOverlay = {
        workflowStep: nextStep,
        status: "inProgress",
      };
      if (current.workflowStep === "start") patch.startedAt = formatTimeNow();

      setActionError(null);
      try {
        await sendWorkflowAction(current.requestType, action, current.apiId);
      } catch (error) {
        // Backend list endpoints don't expose the current workflow step, so the
        // UI can show "start" while the server is already at arrived/left/etc.
        // A 404 here usually means that transition already happened — sync locally.
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

  // The backend has no completion-report endpoint yet; the "deliver" action
  // (sent on the previous step) already moves the request to completed on the
  // server, so the report itself is stored locally.
  const completeRequest = useCallback(
    async (id: number, report: CompletionReport, collectorComment?: string) => {
      patchOverlay(id, {
        status: "completed",
        workflowStep: "done",
        completionReport: report,
        collectorComment,
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
