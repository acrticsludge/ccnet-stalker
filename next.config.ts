import type { NextConfig } from "next";

const NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/:path*", // Point to Express Server Port!
      },
    ];
  },
};

module.exports = NextConfig;
