import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL,
    WS_URL: process.env.WS_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "chathubbucket0710.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "chathubbucket0710.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "chathubbucket1604.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
}

export default nextConfig
