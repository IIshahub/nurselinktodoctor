"use client";

import { useParams } from "next/navigation";
import { useRequests } from "@/src/contexts/RequestsContext";
import RequestDetailsView from "@/src/view/request-details/RequestDetailsView";

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function RequestDetailsPage() {
  const params = useParams();
  const { getRequestById, isLoading } = useRequests();
  const id = Number(params.id);
  const request = getRequestById(id);

  if (isLoading) return <PageLoader />;

  if (request?.status === "new") {
    return <RequestDetailsView request={request} />;
  }

  // request not found or already approved/in-progress/completed → show loader
  // navigation back to "/" is handled by RequestDetailsView itself
  return <PageLoader />;
}
