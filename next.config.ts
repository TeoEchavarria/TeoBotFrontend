import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // experimental: {
  //   turbo: {
  //     loaders: {
  //       // Add any custom loaders here
  //     },
  //   },
  // },
};

export default nextConfig;
