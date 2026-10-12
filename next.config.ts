import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/login", headers: [
      { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
    ] }];
  },
  turbopack: {
    root: projectRoot
  }
};

export default nextConfig;
