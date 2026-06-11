import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버 함수 번들에 data/ 폴더(마크다운·퀴즈 JSON)를 포함시킨다
  outputFileTracingIncludes: {
    "/**": ["./data/**"],
  },
};

export default nextConfig;
