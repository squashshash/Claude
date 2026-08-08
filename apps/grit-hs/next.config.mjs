import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A sibling project's lockfile one level up (Shash/package-lock.json) was
  // making Next infer the wrong workspace root, which could resolve
  // dependencies (including react itself) from that unrelated project's
  // node_modules in dev mode. Pin it explicitly to this app.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
