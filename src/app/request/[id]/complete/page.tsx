"use client";

import { useParams } from "next/navigation";
import { useRequests } from "@/src/contexts/RequestsContext";
import CompleteFormView from "@/src/view/complete-form/CompleteFormView";

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function CompleteFormPage() {
  const params = useParams();
  const { getRequestById, isLoading } = useRequests();
  const id = Number(params.id);
  const request = getRequestById(id);

  if (isLoading) return <PageLoader />;

  if (request?.workflowStep === "left") {
    return <CompleteFormView request={request} />;
  }

  return <PageLoader />;
}
