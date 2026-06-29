import { NextResponse } from "next/server";
import { getAllRequests, replaceAllRequests } from "@/src/lib/requests-store";
import type { LabRequest } from "@/src/types/requests";

export async function GET() {
  try {
    const requests = await getAllRequests();
    return NextResponse.json(requests);
  } catch (error) {
    console.error("[GET /api/requests]", error);
    return NextResponse.json(
      { error: "Failed to load requests" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as LabRequest[];

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await replaceAllRequests(body);
    return NextResponse.json(body);
  } catch (error) {
    console.error("[PUT /api/requests]", error);
    return NextResponse.json(
      { error: "Failed to save requests" },
      { status: 500 },
    );
  }
}
