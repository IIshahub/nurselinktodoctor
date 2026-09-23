import withNextIntl from "next-intl/plugin";
import type { NextConfig } from "next";

// Server-only origin for the rewrite (no /api suffix).
const BACKEND_ORIGIN = (
  process.env.BACKEND_API_URL ?? "https://apinurse.linktodoctor.app"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        // Browser calls same-origin /backend/* to avoid CORS.
        source: "/backend/:path*",
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl("./src/i18n/i18n.ts")(nextConfig);
