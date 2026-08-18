import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/data/seo";

export default function robots(): MetadataRoute.Robots {
  const deploymentEnvironment =
    process.env.VERCEL_ENV ?? process.env.DEPLOYMENT_ENV;
  const isProduction = deploymentEnvironment
    ? deploymentEnvironment === "production"
    : process.env.NODE_ENV === "production";

  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
