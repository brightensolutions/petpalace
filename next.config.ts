import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Move serverComponentsExternalPackages to the root level as serverExternalPackages
  serverExternalPackages: ["jsonwebtoken"],
  experimental: {
    // Remove serverComponentsExternalPackages from experimental
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  // Better for production deployments
  output: "standalone",
};

export default nextConfig;
