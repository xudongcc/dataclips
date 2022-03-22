/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination: `${process.env.SERVER_URL}/api/graphql`,
      },
      {
        source: "/clips/:path.csv",
        destination: `${process.env.SERVER_URL}/clips/:path.csv`,
      },
      {
        source: "/clips/:path.json",
        destination: `${process.env.SERVER_URL}/clips/:path.json`,
      },
    ];
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        crypto: false,
        path: false,
        process: require.resolve("process/browser"),
      };
    }

    return config;
  },
};

module.exports = nextConfig;
