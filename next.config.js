/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Configuration pour Cloudflare Pages
  // Note: Cloudflare Pages supporte Next.js avec le runtime Node.js standard
  // output: 'standalone' n'est pas nécessaire, Cloudflare gère automatiquement
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Configuration pour les routes API
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig

