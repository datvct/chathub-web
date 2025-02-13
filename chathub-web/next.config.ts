import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
}

export default nextConfig
