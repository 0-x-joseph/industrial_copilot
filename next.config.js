/** @type {import('next').NextConfig} */
const nextConfig = {
  // images config for external domains if needed
  images: {
    domains: ['localhost'],
    unoptimized: true, // Required for static export if using it
  },
  // Enable SVG imports
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },
  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig;