import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['172.16.108.57', 'localhost:3000', '192.168.68.117', '172.16.111.103']
} as any;

export default nextConfig;
