import { dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "explore-live.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "explore-qa.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3.eu-west-1.amazonaws.com",
      },
    ],
  },
}

export default nextConfig
