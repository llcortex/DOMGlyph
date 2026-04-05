/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@domglyph/ai-contract",
    "@domglyph/components",
    "@domglyph/primitives",
    "@domglyph/runtime"
  ]
};

export default nextConfig;
