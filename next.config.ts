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
};

export default nextConfig;
