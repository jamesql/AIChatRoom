import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true, // <--- allows importing from outside the root
  },
  eslint: {
    ignoreDuringBuilds: true, // <--- ignore eslint errors
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: 'ts-loader',
      include: [
        path.resolve(__dirname, 'src'),  // your main directory
        path.resolve(__dirname, '../TYPES/*') // <-- adjust this to your external folder
      ]
    });

    return config;
  }
  /* config options here */
};

export default nextConfig;
