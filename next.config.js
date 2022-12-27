/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    NEXT_PUBLIC_PROVIDER_RPC:process.env.NEXT_PUBLIC_PROVIDER_RPC
  }
}

module.exports = nextConfig
