/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    // Standalone `npx tsc --noEmit --incremental false` is used for verification.
    // This avoids a flaky Next Windows build-worker OOM during the built-in TS phase.
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
