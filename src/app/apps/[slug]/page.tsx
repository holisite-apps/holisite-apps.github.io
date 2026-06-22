import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppTemplate } from "@/components/landing/templates/app-template";
import {
  getGeneratedAppSlugs,
  loadAllGeneratedApps,
  loadGeneratedAppData,
} from "@/lib/app-data";
import { loadAppsConfig } from "@/lib/config";
import { normalizeMetaDescription } from "@/lib/seo";
import type { GeneratedAppData } from "@/lib/app-data.schema";

type AppPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

function absoluteUrl(siteUrl: string, path?: string): string | undefined {
  if (!path) {
    return undefined;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${siteUrl}${path}`;
}

const recommendedBibleSlugs = [
  "womens-bible",
  "womens-niv-bible",
  "womens-nkjv-bible-devotionals",
];

const recommendedShoppingSlugs = ["kakosheets", "kakobuy", "hipobuy"];

function getRelatedApps(
  app: GeneratedAppData,
  allApps: GeneratedAppData[],
): GeneratedAppData[] {
  const prioritySlugs =
    app.template === "shopping" ? recommendedShoppingSlugs : recommendedBibleSlugs;

  const priorityApps = prioritySlugs
    .filter((slug) => slug !== app.slug)
    .map((slug) => allApps.find((relatedApp) => relatedApp.slug === slug))
    .filter((relatedApp): relatedApp is GeneratedAppData => Boolean(relatedApp));

  const fallbackApps = allApps.filter(
    (relatedApp) =>
      relatedApp.slug !== app.slug &&
      !prioritySlugs.includes(relatedApp.slug) &&
      relatedApp.template === app.template,
  );

  return [...priorityApps, ...fallbackApps].slice(0, 3);
}

export function generateStaticParams() {
  return getGeneratedAppSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: AppPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getGeneratedAppSlugs();

  if (!slugs.includes(slug)) {
    return {};
  }

  const config = loadAppsConfig();
  const app = loadGeneratedAppData(slug);
  const image = absoluteUrl(config.site.url, app.seo.ogImage);
  const description = normalizeMetaDescription(app.seo.description);

  return {
    title: app.seo.title,
    description,
    alternates: {
      canonical: app.seo.canonical,
    },
    robots: app.seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: app.seo.title,
      description,
      url: app.seo.canonical,
      siteName: config.site.name,
      type: "website",
      images: image
        ? [
            {
              url: image,
              alt: `${app.name} app preview`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: app.seo.title,
      description,
      images: image ? [image] : undefined,
    },
    keywords: app.seo.keywords,
  };
}

export default async function AppPage({ params }: AppPageProps) {
  const { slug } = await params;
  const slugs = getGeneratedAppSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const config = loadAppsConfig();
  const app = loadGeneratedAppData(slug);
  const allApps = loadAllGeneratedApps();
  const relatedApps = getRelatedApps(app, allApps);

  return (
    <AppTemplate
      app={app}
      brandName={config.site.name}
      relatedApps={relatedApps}
    />
  );
}
