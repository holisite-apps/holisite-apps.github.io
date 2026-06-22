import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppTemplate } from "@/components/landing/templates/app-template";
import { getGeneratedAppSlugs, loadGeneratedAppData } from "@/lib/app-data";
import { loadAppsConfig } from "@/lib/config";

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

  return {
    title: app.seo.title,
    description: app.seo.description,
    alternates: {
      canonical: app.seo.canonical,
    },
    robots: app.seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: app.seo.title,
      description: app.seo.description,
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
      description: app.seo.description,
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

  return <AppTemplate app={app} brandName={config.site.name} />;
}
