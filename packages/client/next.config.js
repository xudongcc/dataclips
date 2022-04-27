/** @type {import('next').NextConfig} */
const withLess = require("next-with-less");

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  redirects() {
    return [
      {
        source: "/",
        destination: "/clips",
        permanent: false,
      },
    ];
  },
  rewrites() {
    return [
      ...(process.env.SERVER_URL
        ? [
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
          ]
        : []),
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

module.exports = withLess({
  ...nextConfig,
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        "primary-color": "#165dff",
        "border-radius-base": "4px",
      },
    },
  },
});
