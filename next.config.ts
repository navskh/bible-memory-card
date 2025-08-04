// next.config.js
import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  webpack: config => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    return config;
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig as any);
