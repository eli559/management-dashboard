import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:8090",
        "localhost:3000",
        "localhost:3001",
        "management-dashboard-248948614304.me-west1.run.app",
        "management-dashboard-rzhmieteyq-zf.a.run.app",
      ],
    },
  },
};

export default nextConfig;
