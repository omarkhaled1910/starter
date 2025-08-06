import type { NextConfig } from "next";

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

export default nextConfig;
