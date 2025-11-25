import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker (disable for Vercel)
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,

  // Image optimization - Vercel handles this automatically
  images: {
    unoptimized: process.env.DOCKER_BUILD === 'true',
  },
};

export default nextConfig;
