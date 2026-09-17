import type {
  LabRequest,
  LabRequestDetail,
  RequestStatus,
  WorkflowStep,
} from "@/src/types/requests";

// Same-origin `/backend` proxy (see next.config.ts) so HTTPS pages never
// hit a plain-http API URL (avoids blocked:mixed-content in production).
export const API_BASE = "/backend";

export type ApiRequestType = "prescription" | "checkup";

interface ApiEnvelope<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  errors: unknown[];
  data: T;
}

interface ApiAddressData {
  title: string | null;
  street: string | null;
  city: string | null;
  postalCode: string | null;
  number: string | null;
  floor: string | null;
  unit: string | null;
}

interface ApiCoordinate {
  lat: number;
  long: number;
}

interface ApiSampleRequest {
  id: number;
  dateTime: string;
  coordinate: ApiCoordinate;
  addressData: ApiAddressData;
}

interface ApiSampleLists {
  prescriptionLabQueries: ApiSampleRequest[];
  checkupReservationQueries: ApiSampleRequest[];
}

interface ApiPatient {
  fullName: string | null;
  age: number | null;
  gender: number | null;
  email: string | null;
  phoneNumber: string | null;
}

interface ApiDisease {
  id: number;
  name: string;
}

interface ApiTestItem {
  id?: number;
  name?: string;
  title?: string;
}

interface ApiRequestDetail {
  id: number;
  phoneNumber?: string | number | null;
  nationalCode?: string | null;
  referralTime: string;
  coordinate: ApiCoordinate;
  addressData: ApiAddressData;
  diseases?: ApiDisease[];
  tests?: ApiTestItem[];
  patient: ApiPatient;
  reservationStatus?: number;
  arrivalStatue?: number;
}

export interface FetchedRequestDetail {
  detail: LabRequestDetail;
  workflowStep?: WorkflowStep;
  status?: RequestStatus;
}

// Prescription and checkup ids come from different backend tables and can
// collide, so the UI id encodes both the backend id and the request type.
export function toUiId(apiId: number, type: ApiRequestType): number {
  return apiId * 2 + (type === "checkup" ? 1 : 0);
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

function buildAddress(a: ApiAddressData): string {
  const parts = [
    a.city,
    a.street,
    a.title,
    a.number ? `No. ${a.number}` : null,
    a.floor ? `Floor ${a.floor}` : null,
    a.unit ? `Unit ${a.unit}` : null,
  ].filter((p): p is string => Boolean(p && String(p).trim() && p !== "string"));
  return parts.length > 0 ? parts.join(", ") : "—";
}

function buildMapQuery(coordinate: ApiCoordinate, address: string): string {
  const { lat, long } = coordinate;
  if (lat !== 0 || long !== 0) return `${lat},${long}`;
  return address;
}

function mapGender(gender: number | null | undefined): string {
  if (gender === 0) return "Male";
  if (gender === 1) return "Female";
  return "—";
}

function pickPhone(
  patient: ApiPatient,
  phoneNumber?: string | number | null,
): string {
  if (patient.phoneNumber && String(patient.phoneNumber).trim()) {
    return String(patient.phoneNumber);
  }
  if (phoneNumber !== null && phoneNumber !== undefined && String(phoneNumber).trim()) {
    return String(phoneNumber);
  }
  return "";
}

/**
 * Backend arrivalStatue on detail responses:
 * 0 = start (approved / not yet arrived)
 * 1 = arrived
 * 2 = left
 * 3 = delivered
 */
export function mapArrivalStatue(statue?: number): WorkflowStep | undefined {
  if (statue === 0) return "start";
  if (statue === 1) return "arrived";
  if (statue === 2) return "left";
  if (statue === 3) return "delivered";
  return undefined;
}

function statusFromDetail(
  reservationStatus?: number,
  arrivalStatue?: number,
): RequestStatus | undefined {
  if (reservationStatus === 0) return "new";
  if (arrivalStatue !== undefined && arrivalStatue > 0) return "inProgress";
  if (reservationStatus === 1) return "approved";
  return undefined;
}

function mapDetailPayload(data: ApiRequestDetail): LabRequestDetail {
  const address = buildAddress(data.addressData);
  const date = formatDate(data.referralTime);
  const time = formatTime(data.referralTime);
  const diseases = (data.diseases ?? []).map((d) => d.name).filter(Boolean);
  const tests = (data.tests ?? [])
    .map((t) => t.name ?? t.title ?? "")
    .filter(Boolean)
    .join(", ");

  return {
    patientName: data.patient?.fullName?.trim() || "—",
    phone: pickPhone(data.patient ?? {}, data.phoneNumber),
    gender: mapGender(data.patient?.gender),
    age: data.patient?.age ?? 0,
    tests: tests || "—",
    scheduledDate: date,
    scheduledTime: time,
    requestDate: date,
    requestTime: time,
    diseases,
    outlinedDiseases: [],
    patientComment: "",
    supervisorComment: "",
    address,
    mapQuery: buildMapQuery(data.coordinate, address),
  };
}

function buildListDetail(
  item: ApiSampleRequest,
  address: string,
): LabRequestDetail {
  const date = formatDate(item.dateTime);
  const time = formatTime(item.dateTime);
  return {
    patientName: "—",
    phone: "",
    gender: "—",
    age: 0,
    tests: "—",
    scheduledDate: date,
    scheduledTime: time,
    requestDate: date,
    requestTime: time,
    diseases: [],
    outlinedDiseases: [],
    patientComment: "",
    supervisorComment: "",
    address,
    mapQuery: buildMapQuery(item.coordinate, address),
  };
}

function mapItem(
  item: ApiSampleRequest,
  type: ApiRequestType,
  status: RequestStatus,
): LabRequest {
  const address = buildAddress(item.addressData);
  return {
    id: toUiId(item.id, type),
    apiId: item.id,
    requestType: type,
    title:
      type === "prescription" ? "Prescription Lab Test" : "Checkup Reservation",
    date: formatDate(item.dateTime),
    time: formatTime(item.dateTime),
    address,
    status,
    workflowStep:
      status === "completed"
        ? "done"
        : status === "approved"
          ? "start"
          : undefined,
    detail: buildListDetail(item, address),
  };
}

async function fetchList(
  path: string,
  status: RequestStatus,
): Promise<LabRequest[]> {
  const response = await fetch(`${API_BASE}/SamplingRequest/${path}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`GET ${path} failed with status ${response.status}`);
  }
  const envelope = (await response.json()) as ApiEnvelope<ApiSampleLists>;
  if (!envelope.isSuccess) {
    throw new Error(`GET ${path} failed: ${envelope.message}`);
  }
  const { prescriptionLabQueries = [], checkupReservationQueries = [] } =
    envelope.data ?? {};
  return [
    ...prescriptionLabQueries.map((item) =>
      mapItem(item, "prescription", status),
    ),
    ...checkupReservationQueries.map((item) =>
      mapItem(item, "checkup", status),
    ),
  ];
}

export async function fetchAllRequests(): Promise<LabRequest[]> {
  const [newRequests, confirmed, completed] = await Promise.all([
    fetchList("new-sapmle-requests", "new"),
    fetchList("confirmed-sapmle-requests", "approved"),
    fetchList("completed-sapmle-requests", "completed"),
  ]);

  // Confirmed list has no step field; hydrate arrivalStatue from detail APIs.
  const confirmedWithSteps = await Promise.all(
    confirmed.map(async (request) => {
      try {
        const result = await fetchRequestDetail(
          request.requestType,
          request.apiId,
        );
        const step = result.workflowStep ?? "start";
        const status =
          step === "start"
            ? "approved"
            : step === "done"
              ? "completed"
              : "inProgress";
        return {
          ...request,
          detail: result.detail,
          workflowStep: step,
          status,
          address: result.detail.address || request.address,
          date: result.detail.requestDate || request.date,
          time: result.detail.requestTime || request.time,
        } satisfies LabRequest;
      } catch {
        return request;
      }
    }),
  );

  return [...newRequests, ...confirmedWithSteps, ...completed];
}

const DETAIL_PATHS: Record<ApiRequestType, string> = {
  prescription: "prescription-lab-detail",
  checkup: "checkup-detail",
};

export async function fetchRequestDetail(
  type: ApiRequestType,
  apiId: number,
): Promise<FetchedRequestDetail> {
  const path = DETAIL_PATHS[type];
  const response = await fetch(
    `${API_BASE}/SamplingRequest/${path}/${apiId}`,
    { cache: "no-store" },
  );
  const envelope = await readApiEnvelope(response);
  if (!response.ok || !envelope.isSuccess || !envelope.data) {
    throw new ApiError(
      envelope.message || `GET ${path}/${apiId} failed with status ${response.status}`,
      response.status,
      path,
    );
  }

  const data = envelope.data as ApiRequestDetail;
  return {
    detail: mapDetailPayload(data),
    workflowStep: mapArrivalStatue(data.arrivalStatue),
    status: statusFromDetail(data.reservationStatus, data.arrivalStatue),
  };
}

type WorkflowAction = "approve" | "arrive" | "leave" | "deliver";

const ACTION_PATHS: Record<ApiRequestType, Record<WorkflowAction, string>> = {
  prescription: {
    approve: "approve-new-prescription-lab-request",
    arrive: "arrive-prescription-lab-request",
    leave: "leave-prescription-lab-request",
    deliver: "deliver-prescription-lab-request",
  },
  checkup: {
    approve: "approve-new-Checkup-lab-request",
    arrive: "arrive-Checkup-lab-request",
    leave: "leave-Checkup-lab-request",
    deliver: "deliver-Checkup-lab-request",
  },
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
  type: ApiRequestType,
  action: WorkflowAction,
  apiId: number,
): Promise<void> {
  const path = ACTION_PATHS[type][action];
  // Backend now expects id in the path: /.../{id}
  const response = await fetch(
    `${API_BASE}/SamplingRequest/${path}/${apiId}`,
    { method: "PUT" },
  );
  const envelope = await readApiEnvelope(response);
  if (!response.ok || !envelope.isSuccess) {
    throw new ApiError(
      envelope.message || `PUT ${path}/${apiId} failed with status ${response.status}`,
      response.status,
      path,
    );
  }
}
