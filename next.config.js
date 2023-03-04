/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_ALCHEMY_API_KEY: process.env.NEXT_ALCHEMY_API_KEY,
    NEXT_PUBLIC_PROVIDER_RPC: process.env.NEXT_PUBLIC_PROVIDER_RPC,
    NEXT_BACKEND_URL: process.env.NEXT_BACKEND_URL ?? '',
  },
}

module.exports = nextConfig
