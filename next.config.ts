import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // 👈 disable double render in dev
  devIndicators: false,
 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
