import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Portal routes read cookies/session for admin — Cache Components not adopted yet.
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
