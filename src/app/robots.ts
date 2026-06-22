import type { MetadataRoute } from "next";

import { loadAppsConfig } from "@/lib/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const config = loadAppsConfig();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${config.site.url}/sitemap.xml`,
    host: config.site.url,
  };
}
