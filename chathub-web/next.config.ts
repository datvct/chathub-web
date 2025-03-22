import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: ["cdn.pixabay.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chathubbucket0710.s3.amazonaws.com",
        port: "",
        pathname: "/**", // Cho phép tất cả path
      },
    ],
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
}

export default nextConfig
