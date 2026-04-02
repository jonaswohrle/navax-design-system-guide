/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce RSC payload size for preview performance
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
}

export default nextConfig
