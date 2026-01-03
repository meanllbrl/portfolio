import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

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
    minimumCacheTTL: 172800, // 48 hours cache for optimized images
    // Limit deviceSizes to reduce generated variants (removed 2048, 3840)
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
    // Limit imageSizes for fixed-size images (avatars, icons)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable AVIF for better compression (optional, increases variants but reduces bandwidth)
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(nextConfig);
