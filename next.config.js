/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow larger request bodies for photo uploads (default 4MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '8mb',
    },
  },
};

module.exports = nextConfig;
