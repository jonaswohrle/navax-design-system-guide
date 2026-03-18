import { dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      "https://images.ctfassets.net/**",
      "https://explore-live.s3.eu-west-1.amazonaws.com/**",
      "https://explore-qa.s3.eu-west-1.amazonaws.com/**",
      "https://s3.eu-west-1.amazonaws.com/**",
      "https://images.unsplash.com/**",
      "https://nqlmkxqox66ff90a.public.blob.vercel-storage.com/**",
      "https://*.public.blob.vercel-storage.com/**",
    ],
  },
}

export default nextConfig

