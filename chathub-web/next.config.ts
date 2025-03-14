import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: ['cdn.pixabay.com', 'chathubbucket0710.s3.amazonaws.com'], // Add external domains here
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
}

export default nextConfig
