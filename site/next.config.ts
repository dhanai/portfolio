import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma must not be bundled by Turbopack — it resolves generated client at runtime
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
