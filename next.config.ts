import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // 👈 disable double render in dev
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
