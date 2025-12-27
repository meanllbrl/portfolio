import createNextIntlPlugin from 'next-intl/plugin';

// Disable extraction to avoid @parcel/watcher native binding issues on Vercel
const withNextIntl = createNextIntlPlugin({
  experimental: {
    extraction: false
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
    ],
    // Optional: Configure cache behavior
    // default is 60s for on-demand, 31536000 for static
    minimumCacheTTL: 3600, // 1 hour cache for optimized images
  },
};

export default withNextIntl(nextConfig);
