/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              source: "/api/graphql",
              destination: "http://localhost:5000/api/graphql",
            },
            {
              source: "/clips/:path.csv",
              destination: "http://localhost:5000/clips/:path.csv",
            },
            {
              source: "/clips/:path.json",
              destination: "http://localhost:5000/clips/:path.json",
            },
          ]
        : []),
    ];
  },
};

module.exports = nextConfig;
