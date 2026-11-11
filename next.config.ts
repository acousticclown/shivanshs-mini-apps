import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Soft-nav: keep client router cache warm so back/forward & revisits feel instant.
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
