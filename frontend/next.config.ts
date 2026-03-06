import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },
  async rewrites() {
    const backend =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      (process.env.VERCEL ? "https://resu-match-lyart.vercel.app" : "http://localhost:3001");
    return [{ source: "/api/backend/:path*", destination: `${backend}/:path*` }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
