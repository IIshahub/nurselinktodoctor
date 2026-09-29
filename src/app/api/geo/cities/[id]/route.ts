const GEO_ORIGIN = "https://dash.linktodoctor.app";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return Response.json({ isSuccess: false, data: [] }, { status: 400 });
  }

  const response = await fetch(`${GEO_ORIGIN}/api/Province/cities/${id}`, {
    cache: "no-store",
  });
  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: { "content-type": "application/json" },
  });
}
