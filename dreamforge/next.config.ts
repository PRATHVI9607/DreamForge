import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    //@ts-ignore
    turbopack: {
      resolveAlias: {
        "tailwindcss": "tailwindcss"
      }
    }
  },
};

export default nextConfig;
