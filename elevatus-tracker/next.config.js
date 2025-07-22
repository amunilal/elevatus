/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  // Optimize for Vercel deployment
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Enable experimental features for better performance
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  // Optimize build output
  output: process.env.VERCEL ? undefined : 'standalone',
  // Configure headers for better caching
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        }
      ]
    }
  ]
}

module.exports = nextConfig