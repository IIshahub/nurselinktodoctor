export type AuthTokens = {
  token?: string;
  refreshToken?: string;
  expiration?: string;
};

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1] ||
    null
  );
}

export function persistAuthSession(
  tokens: AuthTokens,
  extras?: { userName?: string; userEmail?: string; userPhone?: string },
) {
  if (!tokens.token || typeof window === "undefined") return;

  document.cookie = `token=${tokens.token}; path=/; max-age=${30 * 24 * 60 * 60}`;
  localStorage.setItem("token", tokens.token);

  if (tokens.refreshToken) {
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }
  if (tokens.expiration) {
    localStorage.setItem("tokenExpiration", tokens.expiration);
  }
  if (extras?.userName) {
    localStorage.setItem("userName", extras.userName);
  }
  if (extras?.userEmail !== undefined) {
    localStorage.setItem("userEmail", extras.userEmail);
  }
  if (extras?.userPhone !== undefined) {
    localStorage.setItem("userPhone", extras.userPhone);
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  ["token", "authToken"].forEach((cookieName) => {
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
  });

  [
    "token",
    "authToken",
    "refreshToken",
    "tokenExpiration",
    "userEmail",
    "userPhone",
    "userName",
  ].forEach((key) => localStorage.removeItem(key));
}
