import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: ['cdn.pixabay.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chathubbucket0710.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'chathubbucket0710.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ]
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
}

export default nextConfig
