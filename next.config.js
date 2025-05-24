/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure webpack to properly handle face-api.js
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    return config;
  },
  // To handle audio processing libraries
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig; 