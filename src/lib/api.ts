import { getAuthToken } from "@/src/lib/session";
import type {
  CareRequest,
  CareRequestDetail,
  RequestStatus,
  WorkflowStep,
} from "@/src/types/requests";

// Nurse API origin. Override with NEXT_PUBLIC_BACKEND_API_URL if needed.
export const API_BASE = (
  process.env.NEXT_PUBLIC_BACKEND_API_URL ??
  "https://apinurse.linktodoctor.app/api"
).replace(/\/$/, "");

interface ApiEnvelope<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  errors: unknown[];
  data: T;
}

interface ApiHomeTreatmentItem {
  id: number;
  name: string[] | null;
  reservationDate: string;
  reservationStatus: number;
  arrivalStatue: number;
}

interface ApiHomeTreatmentLists {
  homeTreatmentRequestQueries: ApiHomeTreatmentItem[];
}

export interface FetchedRequestDetail {
  detail: CareRequestDetail;
  workflowStep?: WorkflowStep;
  status?: RequestStatus;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function joinServices(name: string[] | null | undefined): string {
  const parts = (name ?? [])
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

/**
 * Backend arrivalStatue on list responses:
 * 0 = start (approved / not yet arrived)
 * 1 = arrived
 * 2 = left
 */
export function mapArrivalStatue(statue?: number): WorkflowStep | undefined {
  if (statue === 0) return "start";
  if (statue === 1) return "arrived";
  if (statue === 2) return "left";
  return undefined;
}

function statusFromItem(
  listStatus: RequestStatus,
  reservationStatus?: number,
  arrivalStatue?: number,
): RequestStatus {
  if (listStatus === "completed") return "completed";
  if (listStatus === "new") return "new";
  if (arrivalStatue !== undefined && arrivalStatue > 0) return "inProgress";
  if (reservationStatus === 1) return "approved";
  return listStatus;
}

function buildDetail(item: ApiHomeTreatmentItem): CareRequestDetail {
  const date = formatDate(item.reservationDate);
  const time = formatTime(item.reservationDate);
  const services = joinServices(item.name);

  return {
    patientName: "—",
    phone: "",
    gender: "—",
    age: 0,
    services,
    scheduledDate: date,
    scheduledTime: time,
    requestDate: date,
    requestTime: time,
    diseases: [],
    outlinedDiseases: [],
    patientComment: "",
    supervisorComment: "",
    address: "—",
    mapQuery: "",
  };
}

function mapItem(
  item: ApiHomeTreatmentItem,
  listStatus: RequestStatus,
): CareRequest {
  const services = joinServices(item.name);
  const step =
    listStatus === "completed"
      ? "done"
      : listStatus === "new"
        ? undefined
        : (mapArrivalStatue(item.arrivalStatue) ?? "start");

  return {
    id: item.id,
    apiId: item.id,
    title: services !== "—" ? services : "Home Care Request",
    date: formatDate(item.reservationDate),
    time: formatTime(item.reservationDate),
    address: "—",
    status: statusFromItem(
      listStatus,
      item.reservationStatus,
      item.arrivalStatue,
    ),
    workflowStep: step,
    detail: buildDetail(item),
  };
}

function withAuth(init?: RequestInit): RequestInit {
  const headers = new Headers(init?.headers);
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return { ...init, headers };
}

async function fetchList(
  path: string,
  status: RequestStatus,
): Promise<CareRequest[]> {
  const response = await fetch(
    `${API_BASE}/HomeTreatment/${path}`,
    withAuth({ cache: "no-store" }),
  );
  if (!response.ok) {
    throw new Error(`GET ${path} failed with status ${response.status}`);
  }
  const envelope = (await response.json()) as ApiEnvelope<ApiHomeTreatmentLists>;
  if (!envelope.isSuccess) {
    throw new Error(`GET ${path} failed: ${envelope.message}`);
  }
  const items = envelope.data?.homeTreatmentRequestQueries ?? [];
  return items.map((item) => mapItem(item, status));
}

export async function fetchAllRequests(): Promise<CareRequest[]> {
  const [newRequests, confirmed, completed] = await Promise.all([
    fetchList("new-sapmle-requests", "new"),
    fetchList("confirmed-requests", "approved"),
    fetchList("completed-requests", "completed"),
  ]);

  return [...newRequests, ...confirmed, ...completed];
}

/**
 * Nurse gateway OpenAPI has no detail endpoint yet — return the list-shaped
 * detail already attached to the request (or a minimal placeholder).
 */
export async function fetchRequestDetail(
  apiId: number,
  fallback?: CareRequest,
): Promise<FetchedRequestDetail> {
  if (fallback && fallback.apiId === apiId && fallback.detail) {
    return {
      detail: fallback.detail,
      workflowStep: fallback.workflowStep,
      status: fallback.status,
    };
  }

  // Re-fetch lists so a deep-linked request still hydrates after refresh.
  const all = await fetchAllRequests();
  const found = all.find((r) => r.apiId === apiId);
  if (!found?.detail) {
    throw new ApiError(
      `Request ${apiId} not found`,
      404,
      "HomeTreatment",
    );
  }

  return {
    detail: found.detail,
    workflowStep: found.workflowStep,
    status: found.status,
  };
}

type WorkflowAction = "approve" | "arrive" | "leave";

const ACTION_PATHS: Record<WorkflowAction, string> = {
  approve: "approve-new-request",
  arrive: "arrive-request",
  leave: "leave-request",
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function readApiEnvelope(
  response: Response,
): Promise<ApiEnvelope<unknown>> {
  try {
    return (await response.json()) as ApiEnvelope<unknown>;
  } catch {
    return {
      isSuccess: false,
      statusCode: response.status,
      message: response.statusText || "Request failed",
      errors: [],
      data: null,
    };
  }
}

export async function sendWorkflowAction(
  action: WorkflowAction,
  apiId: number,
): Promise<void> {
  const path = ACTION_PATHS[action];
  const response = await fetch(
    `${API_BASE}/HomeTreatment/${path}/${apiId}`,
    withAuth({ method: "PUT" }),
  );
  const envelope = await readApiEnvelope(response);
  if (!response.ok || !envelope.isSuccess) {
    throw new ApiError(
      envelope.message ||
        `PUT ${path}/${apiId} failed with status ${response.status}`,
      response.status,
      path,
    );
  }
}
