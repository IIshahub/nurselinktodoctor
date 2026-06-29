import type { LabRequest, RequestStatus, WorkflowStep } from "@/src/types/requests";

export const STEP_COLORS: Record<WorkflowStep, string> = {
  start: "#0D50FF",
  arrived: "#F97316",
  left: "#38BDF8",
  delivered: "#9333EA",
  done: "#22C55E",
};

export function getStatusForStep(step: WorkflowStep): RequestStatus {
  if (step === "start") return "approved";
  if (step === "done") return "completed";
  return "inProgress";
}

export function getActiveWorkflowRequests(requests: LabRequest[]) {
  return requests.filter(
    (request) =>
      request.workflowStep &&
      request.status !== "completed" &&
      request.status !== "new",
  );
}

export function formatTimeNow() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
