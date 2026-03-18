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
      new URL("https://images.ctfassets.net/**"),
      new URL("https://explore-live.s3.eu-west-1.amazonaws.com/**"),
      new URL("https://explore-qa.s3.eu-west-1.amazonaws.com/**"),
      new URL("https://s3.eu-west-1.amazonaws.com/**"),
      new URL("https://images.unsplash.com/**"),
      new URL("https://nqlmkxqox66ff90a.public.blob.vercel-storage.com/**"),
      new URL("https://*.public.blob.vercel-storage.com/**"),
    ],
  },
}

export default nextConfig

