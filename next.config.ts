import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 75, 80, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
