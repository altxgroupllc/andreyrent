import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev overlay badge sits exactly where the mobile action bar lives, which makes
  // thumb-reach QA unreadable. Off while we are evaluating mobile layouts.
  devIndicators: false,
};

export default nextConfig;
