"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { initialRequests } from "@/src/data/initialRequests";
import { getRequestDetail } from "@/src/data/requestDetails";
import { formatTimeNow } from "@/src/lib/workflow";
import type {
  CompletionReport,
  LabRequest,
  LabRequestDetail,
  RequestStatus,
} from "@/src/types/requests";
import { WORKFLOW_STEPS } from "@/src/types/requests";

const STORAGE_KEY = "lablinktodoctor-requests";
export const TAB_STORAGE_KEY = "lablinktodoctor-tab";

const STATUS_RANK: Record<RequestStatus, number> = {
  new: 0,
  approved: 1,
  inProgress: 2,
  completed: 3,
};

function workflowRank(step?: LabRequest["workflowStep"]) {
  if (!step) return -1;
  return WORKFLOW_STEPS.indexOf(step);
}

function mergeRequests(local: LabRequest[], api: LabRequest[]): LabRequest[] {
  const apiById = new Map(api.map((r) => [r.id, r]));
  const localById = new Map(local.map((r) => [r.id, r]));
  const allIds = new Set([
    ...local.map((r) => r.id),
    ...api.map((r) => r.id),
  ]);

  return Array.from(allIds)
    .sort((a, b) => a - b)
    .map((id) => {
      const localReq = localById.get(id);
      const apiReq = apiById.get(id);
      if (!localReq) return apiReq!;
      if (!apiReq) return localReq;

      const localRank = STATUS_RANK[localReq.status];
      const apiRank = STATUS_RANK[apiReq.status];
      if (apiRank !== localRank) return apiRank > localRank ? apiReq : localReq;

      const localStep = workflowRank(localReq.workflowStep);
      const apiStep = workflowRank(apiReq.workflowStep);
      return apiStep > localStep ? apiReq : localReq;
    });
}

function save(next: LabRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function loadLocalRequests(): LabRequest[] {
  if (typeof window === "undefined") return initialRequests;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as LabRequest[];
  } catch {
    // ignore
  }
  return initialRequests;
}

async function patchRequest(id: number, patch: Partial<LabRequest>) {
  const response = await fetch(`/api/requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!response.ok) throw new Error("Failed to update request");
  return (await response.json()) as LabRequest;
}

async function syncAll(requests: LabRequest[]) {
  await fetch("/api/requests", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requests),
  });
}

interface RequestsContextValue {
  requests: LabRequest[];
  isLoading: boolean;
  approveRequest: (id: number, detail?: LabRequestDetail) => Promise<void>;
  ignoreRequest: (id: number) => Promise<void>;
  advanceWorkflow: (id: number) => Promise<LabRequest | undefined>;
  completeRequest: (
    id: number,
    report: CompletionReport,
    collectorComment?: string,
  ) => Promise<void>;
  getRequestById: (id: number) => LabRequest | undefined;
}

const RequestsContext = createContext<RequestsContextValue | undefined>(undefined);

export function RequestsProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<LabRequest[]>(initialRequests);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const local = loadLocalRequests();
      try {
        const response = await fetch("/api/requests");
        if (!response.ok) {
          setRequests(local);
          return;
        }
        const apiData = (await response.json()) as LabRequest[];
        const hasLocalProgress = local.some(
          (r) => r.status !== "new" || r.workflowStep || r.completionReport,
        );
        const data = hasLocalProgress ? mergeRequests(local, apiData) : apiData;
        setRequests(data);
        save(data);
        if (hasLocalProgress) {
          syncAll(data).catch(() => undefined);
        }
      } catch {
        setRequests(local);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const getRequestById = useCallback(
    (id: number) => requests.find((r) => r.id === id),
    [requests],
  );

  // Applies patch to the current snapshot, saves to localStorage synchronously,
  // updates react state, then tries to sync to API in background.
  const applyAndSync = useCallback(
    (id: number, patch: Partial<LabRequest>): LabRequest[] => {
      const next = requests.map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      );
      save(next); // ← synchronous, happens BEFORE any navigation
      setRequests(next);
      patchRequest(id, patch).then((updated) => {
        setRequests((prev) => {
          const fresh = prev.map((r) => (r.id === id ? updated : r));
          save(fresh);
          return fresh;
        });
      }).catch(() => {
        // already saved locally, good enough
      });
      return next;
    },
    [requests],
  );

  const approveRequest = useCallback(
    async (id: number, detail?: LabRequestDetail) => {
      const current = requests.find((r) => r.id === id);
      if (!current) return;
      const resolvedDetail = detail ?? getRequestDetail(current);
      applyAndSync(id, {
        status: "approved",
        workflowStep: "start",
        detail: resolvedDetail,
        date: resolvedDetail.requestDate,
        time: resolvedDetail.requestTime,
        address: resolvedDetail.address,
      });
    },
    [requests, applyAndSync],
  );

  const ignoreRequest = useCallback(
    async (id: number) => {
      const next = requests.filter((r) => r.id !== id);
      save(next);
      setRequests(next);
      syncAll(next).catch(() => undefined);
    },
    [requests],
  );

  const advanceWorkflow = useCallback(
    async (id: number) => {
      const current = requests.find((r) => r.id === id);
      if (!current?.workflowStep) return undefined;

      const currentIndex = WORKFLOW_STEPS.indexOf(current.workflowStep);
      const nextStep = WORKFLOW_STEPS[currentIndex + 1];
      if (!nextStep || current.workflowStep === "delivered") return current;

      const patch: Partial<LabRequest> = { workflowStep: nextStep, status: "inProgress" };
      if (current.workflowStep === "start") patch.startedAt = formatTimeNow();

      const next = applyAndSync(id, patch);
      return next.find((r) => r.id === id);
    },
    [requests, applyAndSync],
  );

  const completeRequest = useCallback(
    async (id: number, report: CompletionReport, collectorComment?: string) => {
      const patch: Partial<LabRequest> = {
        status: "completed",
        workflowStep: "done",
        completionReport: report,
        collectorComment,
        completedAt: formatTimeNow(),
        date: "Today",
        time: formatTimeNow(),
      };
      applyAndSync(id, patch); // saves localStorage synchronously before caller navigates
    },
    [applyAndSync],
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
    }),
    [
      requests,
      isLoading,
      approveRequest,
      ignoreRequest,
      advanceWorkflow,
      completeRequest,
      getRequestById,
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
