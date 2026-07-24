import withNextIntl from "next-intl/plugin";
import type { NextConfig } from "next";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? "http://95.38.137.230:8082";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Proxy browser calls through Next to avoid CORS with the external backend.
    return [
      {
        source: "/backend/:path*",
        destination: `${BACKEND_API_URL}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl("./src/i18n/i18n.ts")(nextConfig);
