import withNextIntl from "next-intl/plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withNextIntl("./src/i18n/i18n.ts")(nextConfig);
