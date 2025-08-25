import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
 
 
const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.moralis.io",
      },
    ],
  },

  experimental: {
    // ppr: "incremental",
  },
  serverExternalPackages: ["@napi-rs/canvas"],
};

export default withNextIntl(nextConfig);
