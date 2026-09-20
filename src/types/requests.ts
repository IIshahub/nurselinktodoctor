export type RequestStatus = "new" | "approved" | "inProgress" | "completed";

export type WorkflowStep = "start" | "arrived" | "left" | "delivered" | "done";

export interface LabRequestDetail {
  patientName: string;
  phone: string;
  gender: string;
  age: number;
  tests: string;
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

export interface LabRequest {
  id: number;
  /** Raw backend id (prescription and checkup ids can collide). */
  apiId: number;
  /** Which backend entity this request belongs to. */
  requestType: "prescription" | "checkup";
  title: string;
  date: string;
  time: string;
  address: string;
  isEmergency?: boolean;
  status: RequestStatus;
  workflowStep?: WorkflowStep;
  detail?: LabRequestDetail;
  startedAt?: string;
  completedAt?: string;
  collectorComment?: string;
  completionReport?: CompletionReport;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  "start",
  "arrived",
  "left",
  "delivered",
  "done",
];
