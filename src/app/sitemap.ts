import type { MetadataRoute } from "next";

import { loadAllGeneratedApps, loadAppManifest } from "@/lib/app-data";
import { loadAppsConfig } from "@/lib/config";

export const dynamic = "force-static";

function toAbsoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const config = loadAppsConfig();
  const manifest = loadAppManifest();
  const apps = loadAllGeneratedApps();

  return [
    {
      url: config.site.url,
      lastModified: manifest.fetchedAt,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...apps
      .filter((app) => !app.seo.noindex)
      .map((app) => ({
        url: app.seo.canonical,
        lastModified: app.updatedAt ?? app.fetchedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: [
          app.media.icon ? toAbsoluteUrl(config.site.url, app.media.icon) : undefined,
          ...app.media.screenshots.map((screenshot) =>
            toAbsoluteUrl(config.site.url, screenshot),
          ),
        ].filter((image): image is string => Boolean(image)),
      })),
  ];
}
