const FLASH_TOKEN_URL = "https://iotype.com/io/v1/flash-token";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function extractFlashToken(payload: unknown): string | undefined {
  if (typeof payload === "string" && payload.trim()) return payload.trim();

  const root = asRecord(payload);
  if (!root) return undefined;

  for (const key of ["token", "flash_token", "flashToken", "access_token"]) {
    const value = root[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return extractFlashToken(root.data);
}

export async function POST() {
  const accessToken = process.env.IOTYPE_TOKEN?.trim();
  if (!accessToken) {
    return Response.json({ error: "missing_api_key" }, { status: 500 });
  }

  try {
    const response = await fetch(FLASH_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      cache: "no-store",
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("iotype flash-token failed:", response.status, result);
      return Response.json(
        { error: "flash_token_failed" },
        { status: response.status === 401 ? 401 : 502 },
      );
    }

    const token = extractFlashToken(result);
    if (!token) {
      console.error("iotype flash-token missing token field:", result);
      return Response.json({ error: "flash_token_invalid" }, { status: 502 });
    }

    return Response.json({ token });
  } catch (error) {
    console.error("iotype flash-token error:", error);
    return Response.json({ error: "flash_token_failed" }, { status: 502 });
  }
}
