import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phones on the same Wi-Fi opening the dev server via this computer's LAN IP. Hostnames only (no
  // protocol or port); any 192.168.x.x address, so live reload keeps working when the router changes the IP.
  allowedDevOrigins: ["192.168.*.*", "localhost"],
  // Pin the project root so a stray lockfile in a parent folder isn't picked up.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  // Product photos (see cloudinaryBaseUrl in lib/site.ts).
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/uw678pyp/image/upload/**" }],
  },
};

export default nextConfig;
