import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.pinterest.com",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /@wagmi\/connectors/ },
      { message: /Can't resolve.*porto/ },
      { message: /Can't resolve.*@react-native-async-storage/ },
    ];
    config.resolve.fallback = {
      ...config.resolve.fallback,
      porto: false,
      '@react-native-async-storage/async-storage': false,
    };
    return config;
  },
};

export default nextConfig;
