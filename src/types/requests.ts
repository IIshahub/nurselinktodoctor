export type RequestStatus = "new" | "approved" | "inProgress" | "completed";

/** Nurse home-care workflow — API has approve / arrive / leave (no deliver). */
export type WorkflowStep = "start" | "arrived" | "left" | "done";

export interface CareRequestDetail {
  patientName: string;
  phone: string;
  gender: string;
  age: number;
  /** Joined home-care service names from the API `name` array. */
  services: string;
  scheduledDate: string;
  scheduledTime: string;
  requestDate: string;
  requestTime: string;
  diseases: string[];
  outlinedDiseases: string[];
  patientComment: string;
  supervisorComment: string;
  address: string;
  mapQuery: string;
  /** WGS84 latitude when available from backend */
  lat?: number;
  /** WGS84 longitude when available from backend */
  lng?: number;
}

export interface CompletionReport {
  type: "text" | "voice";
  content: string;
  createdAt: string;
}

export interface CareRequest {
  id: number;
  /** Raw backend id. */
  apiId: number;
  title: string;
  date: string;
  time: string;
  address: string;
  isEmergency?: boolean;
  status: RequestStatus;
  workflowStep?: WorkflowStep;
  detail?: CareRequestDetail;
  startedAt?: string;
  completedAt?: string;
  nurseComment?: string;
  completionReport?: CompletionReport;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  "start",
  "arrived",
  "left",
  "done",
];
