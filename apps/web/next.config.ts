import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@rae/shared"],
  // Standalone output keeps the production image small.
  output: "standalone",
};

export default nextConfig;
