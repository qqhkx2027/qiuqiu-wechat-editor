import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/qiuqiu-wechat-editor" : "",
  images: { unoptimized: true },
};

export default nextConfig;
