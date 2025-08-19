import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true, // or false for temporary redirect
      },
    ];
  },
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
