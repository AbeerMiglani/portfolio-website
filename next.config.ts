import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Command-line HTTP clients asking for the home page get a plain-text résumé
  // instead of HTML: `curl https://portfolio.abbykayo.com`. Browsers are
  // unaffected, and both responses stay static.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "header", key: "user-agent", value: "^(curl|[Ww]get|HTTPie|xh)/.*" }],
          destination: "/resume.ansi",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
