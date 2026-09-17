import withNextIntl from "next-intl/plugin";
import type { NextConfig } from "next";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? "https://apilab.linktodoctor.app";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Browser stays on same origin (HTTPS); Next proxies to the backend.
    return [
      {
        source: "/backend/:path*",
        destination: `${BACKEND_API_URL.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl("./src/i18n/i18n.ts")(nextConfig);
