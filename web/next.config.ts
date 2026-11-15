import type { NextConfig } from "next";

// GitHub Pages serves a project site from /<repo-name>/. Set NEXT_PUBLIC_BASE_PATH at build time (the deploy
// workflow does); leave it unset for local dev and for a custom domain at the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath ? { basePath } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
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
