import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable the Next.js dev indicator (N icon at bottom)
  devIndicators: false,

  // Allow external images from Unsplash for team profiles
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
