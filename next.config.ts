import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://192.168.136.1:3000", "http://localhost:3000"],
  // Pin the project root so a stray lockfile in a parent folder isn't picked up.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  // Product photos (see cloudinaryBaseUrl in lib/site.ts).
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/uw678pyp/image/upload/**" }],
  },
};

export default nextConfig;
