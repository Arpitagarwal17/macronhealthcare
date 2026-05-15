import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { webpack }) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "node:fs": false,
      "node:https": false,
      fs: false,
      https: false,
      "image-size": false,
    };
    config.resolve.fallback = {
      ...(config.resolve.fallback ?? {}),
      fs: false,
      https: false,
      os: false,
      path: false,
    };
    config.plugins = config.plugins ?? [];
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^node:(fs|https)$/,
      }),
    );

    return config;
  },
};

export default nextConfig;
