const GEO_ORIGIN = "https://dash.linktodoctor.app";

export async function GET() {
  const response = await fetch(`${GEO_ORIGIN}/api/Province/provinces`, {
    cache: "no-store",
  });
  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: { "content-type": "application/json" },
  });
}
