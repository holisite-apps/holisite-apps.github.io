#!/usr/bin/env npx tsx
import { mkdir, rm, writeFile } from "node:fs/promises";
import { basename as pathBasename, extname, join } from "node:path";
import { createRequire } from "node:module";

import {
  getAppCanonicalUrl,
  getEnabledApps,
  loadAppsConfig,
} from "../src/lib/config";
import type { AppConfig, AppsConfig } from "../src/lib/config.schema";

const require = createRequire(import.meta.url);
const appStore = require("app-store-scraper");
const googlePlayPackage = require("google-play-scraper");
const googlePlay = googlePlayPackage.default ?? googlePlayPackage;

const DATA_DIR = "data";
const APP_DATA_DIR = join(DATA_DIR, "apps");
const ASSETS_DIR = join("public", "assets", "apps");
const MAX_SCREENSHOTS = 8;

type StorePlatform = "ios" | "android";

type StoreApp = Record<string, unknown>;

type TrackingConfig = {
  enabled: boolean;
  utmSource: string;
  utmMedium: string;
  campaign?: string;
  iosProviderToken?: string;
};

type FetchStatus =
  | { slug: string; status: "ok"; platforms: StorePlatform[] }
  | { slug: string; status: "error"; error: string };

type PageData = {
  slug: string;
  template: string;
  fetchedAt: string;
  primarySource: StorePlatform;
  name: string;
  tagline: string;
  description: string;
  descriptionHtml?: string;
  version?: string;
  updatedAt?: string;
  developer?: string;
  category?: string;
  rating?: {
    score: number;
    count: number;
  };
  releaseNotes?: string;
  stores: {
    ios?: {
      url: string;
      appId?: string;
      id?: number;
    };
    android?: {
      url: string;
      appId: string;
      installs?: string;
      minInstalls?: number;
    };
  };
  media: {
    icon?: string;
    screenshots: string[];
    headerImage?: string;
  };
  seo: {
    title: string;
    description: string;
    canonical: string;
    ogImage?: string;
    keywords?: string[];
    targetKeywords: string[];
    relatedTerms: string[];
    keywordIntro?: string;
    noindex?: boolean;
  };
  features: NonNullable<AppConfig["features"]>;
  valueProps: NonNullable<AppConfig["valueProps"]>;
  faq: NonNullable<AppConfig["faq"]>;
  links: NonNullable<AppConfig["links"]>;
  hasIos: boolean;
  hasAndroid: boolean;
};

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}

function toIsoDate(value: unknown): string | undefined {
  if (typeof value === "number") {
    return new Date(value).toISOString();
  }

  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
  }

  return undefined;
}

function firstSentence(text?: string): string {
  if (!text) {
    return "";
  }

  const normalized = text.replace(/\s+/g, " ").trim();
  const match = normalized.match(/^(.{40,180}?[.!?])\s/);
  return match?.[1] ?? normalized.slice(0, 160);
}

function mergeKeywords(...groups: (string[] | undefined)[]): string[] {
  return uniqueStrings(
    groups
      .flatMap((group) => group ?? [])
      .map((keyword) => keyword.trim())
      .filter(Boolean),
  );
}

function resolveTrackingConfig(
  config: AppsConfig,
  app: AppConfig,
): TrackingConfig {
  return {
    enabled: app.tracking?.enabled ?? config.site.tracking?.enabled ?? true,
    utmSource:
      app.tracking?.utmSource ?? config.site.tracking?.utmSource ?? "holisite",
    utmMedium:
      app.tracking?.utmMedium ??
      config.site.tracking?.utmMedium ??
      "landing_page",
    campaign: app.tracking?.campaign ?? config.site.tracking?.campaign ?? app.slug,
    iosProviderToken:
      app.tracking?.iosProviderToken ?? config.site.tracking?.iosProviderToken,
  };
}

function appendQueryParams(
  url: string,
  params: Record<string, string | undefined>,
): string {
  const parsed = new URL(toHttpsUrl(url));

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      parsed.searchParams.set(key, value);
    }
  });

  return parsed.toString();
}

function buildAndroidReferrer(tracking: TrackingConfig, content: string): string {
  const params = new URLSearchParams({
    utm_source: tracking.utmSource,
    utm_medium: tracking.utmMedium,
    utm_campaign: tracking.campaign ?? "landing_page",
    utm_content: content,
  });

  return params.toString();
}

function withStoreTracking(
  url: string,
  platform: StorePlatform,
  tracking: TrackingConfig,
): string {
  if (!tracking.enabled) {
    return url;
  }

  const content =
    platform === "ios" ? "app_store_button" : "google_play_button";

  if (platform === "android") {
    return appendQueryParams(url, {
      referrer: buildAndroidReferrer(tracking, content),
    });
  }

  return appendQueryParams(url, {
    utm_source: tracking.utmSource,
    utm_medium: tracking.utmMedium,
    utm_campaign: tracking.campaign ?? "landing_page",
    utm_content: content,
    ct: `${tracking.campaign ?? "landing_page"}_${content}`,
    pt: tracking.iosProviderToken,
  });
}

function buildDefaultSeoTitle(name: string, iosApp: StoreApp | undefined, androidApp: StoreApp | undefined): string {
  if (iosApp && androidApp) {
    return `${name} - Download on App Store & Google Play`;
  }

  if (iosApp) {
    return `${name} - Download on the App Store`;
  }

  return `${name} - Get it on Google Play`;
}

function toHttpsUrl(url: string): string {
  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  return url;
}

function extensionFromContentType(contentType: string | null): string | undefined {
  if (!contentType) {
    return undefined;
  }

  if (contentType.includes("image/webp")) return ".webp";
  if (contentType.includes("image/png")) return ".png";
  if (contentType.includes("image/jpeg")) return ".jpg";
  if (contentType.includes("image/jpg")) return ".jpg";
  if (contentType.includes("image/svg")) return ".svg";

  return undefined;
}

function extensionFromUrl(url: string): string | undefined {
  const pathname = new URL(toHttpsUrl(url)).pathname;
  const extension = extname(pathname).toLowerCase();
  return extension.length > 0 ? extension : undefined;
}

async function downloadImage(
  url: string | undefined,
  targetDir: string,
  basename: string,
): Promise<string | undefined> {
  if (!url) {
    return undefined;
  }

  if (url.startsWith("/")) {
    return url;
  }

  const sourceUrl = toHttpsUrl(url);
  const response = await fetch(sourceUrl);

  if (!response.ok) {
    throw new Error(`Failed to download ${sourceUrl}: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  const extension =
    extensionFromContentType(contentType) ?? extensionFromUrl(sourceUrl) ?? ".jpg";
  const filename = `${basename}${extension}`;
  const destination = join(targetDir, filename);
  const bytes = Buffer.from(await response.arrayBuffer());

  await writeFile(destination, bytes);

  return `/assets/apps/${pathBasename(targetDir)}/${filename}`;
}

async function fetchIosApp(app: AppConfig): Promise<StoreApp | undefined> {
  const ios = app.stores.ios;

  if (!ios) {
    return undefined;
  }

  return appStore.app({
    id: ios.id,
    appId: ios.appId,
    country: ios.country,
    lang: ios.lang,
    ratings: true,
  });
}

async function fetchAndroidApp(app: AppConfig): Promise<StoreApp | undefined> {
  const android = app.stores.android;

  if (!android) {
    return undefined;
  }

  return googlePlay.app({
    appId: android.appId,
    country: android.country,
    lang: android.lang,
    throttle: 1,
  });
}

function resolvePrimary(
  iosApp: StoreApp | undefined,
  androidApp: StoreApp | undefined,
): { source: StorePlatform; data: StoreApp } {
  if (iosApp) {
    return { source: "ios", data: iosApp };
  }

  if (androidApp) {
    return { source: "android", data: androidApp };
  }

  throw new Error("No store data fetched");
}

function resolveRating(app: AppConfig, primary: StoreApp): PageData["rating"] {
  if (app.overrides?.rating) {
    return app.overrides.rating;
  }

  const score = asNumber(primary.score);
  const count = asNumber(primary.ratings) ?? asNumber(primary.reviews);

  if (score == null || count == null) {
    return undefined;
  }

  return { score, count };
}

function buildStores(
  iosApp: StoreApp | undefined,
  androidApp: StoreApp | undefined,
  app: AppConfig,
  config: AppsConfig,
): PageData["stores"] {
  const stores: PageData["stores"] = {};
  const tracking = resolveTrackingConfig(config, app);

  if (iosApp) {
    const url = asString(iosApp.url) ?? "";

    stores.ios = {
      url: url ? withStoreTracking(url, "ios", tracking) : "",
      appId: asString(iosApp.appId) ?? app.stores.ios?.appId,
      id: asNumber(iosApp.id) ?? app.stores.ios?.id,
    };
  }

  if (androidApp && app.stores.android) {
    const url = asString(androidApp.url) ?? "";

    stores.android = {
      url: url ? withStoreTracking(url, "android", tracking) : "",
      appId: asString(androidApp.appId) ?? app.stores.android.appId,
      installs: asString(androidApp.installs),
      minInstalls: asNumber(androidApp.minInstalls),
    };
  }

  return stores;
}

async function buildMedia(
  app: AppConfig,
  primary: StoreApp,
  androidApp: StoreApp | undefined,
): Promise<PageData["media"]> {
  const targetDir = join(ASSETS_DIR, app.slug);
  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir, { recursive: true });

  const iconSource = app.overrides?.icon ?? asString(primary.icon);
  const primaryScreenshots = uniqueStrings(asStringArray(primary.screenshots));
  const androidScreenshots = uniqueStrings(asStringArray(androidApp?.screenshots));
  const screenshotSources =
    app.overrides?.screenshots ??
    (primaryScreenshots.length > 0 ? primaryScreenshots : androidScreenshots).slice(0, MAX_SCREENSHOTS);
  const headerImageSource =
    asString(primary.headerImage) ?? asString(androidApp?.headerImage);

  const icon = await downloadImage(iconSource, targetDir, "icon");
  const screenshots: string[] = [];

  for (const [index, screenshot] of screenshotSources.entries()) {
    const localPath = await downloadImage(
      screenshot,
      targetDir,
      `screenshot-${index + 1}`,
    );

    if (localPath) {
      screenshots.push(localPath);
    }
  }

  const headerImage = await downloadImage(headerImageSource, targetDir, "header");

  return {
    icon,
    screenshots,
    headerImage,
  };
}

async function buildPageData(
  config: AppsConfig,
  app: AppConfig,
): Promise<PageData> {
  const [iosApp, androidApp] = await Promise.all([
    fetchIosApp(app),
    fetchAndroidApp(app),
  ]);
  const primary = resolvePrimary(iosApp, androidApp);
  const primaryData = primary.data;
  const description =
    app.overrides?.description ?? asString(primaryData.description) ?? "";
  const name = app.name ?? asString(primaryData.title) ?? app.slug;
  const tagline =
    app.overrides?.tagline ??
    asString(primaryData.summary) ??
    firstSentence(description);
  const media = await buildMedia(app, primaryData, androidApp);
  const rating = resolveRating(app, primaryData);
  const canonical = getAppCanonicalUrl(config, app.slug);
  const seoDescription =
    app.seo?.description ?? tagline ?? firstSentence(description);
  const targetKeywords = app.seo?.targetKeywords ?? [];
  const relatedTerms = app.seo?.relatedTerms ?? [];
  const keywords = mergeKeywords(
    app.seo?.keywords,
    targetKeywords,
    relatedTerms,
  );

  return {
    slug: app.slug,
    template: app.template,
    fetchedAt: new Date().toISOString(),
    primarySource: primary.source,
    name,
    tagline,
    description,
    descriptionHtml:
      app.overrides?.descriptionHtml ?? asString(primaryData.descriptionHTML),
    version: asString(primaryData.version),
    updatedAt: toIsoDate(primaryData.updated),
    developer: app.overrides?.developer ?? asString(primaryData.developer),
    category:
      app.overrides?.category ??
      asString(primaryData.primaryGenre) ??
      asString(primaryData.genre),
    rating,
    releaseNotes:
      app.overrides?.releaseNotes ??
      asString(primaryData.releaseNotes) ??
      asString(primaryData.recentChanges),
    stores: buildStores(iosApp, androidApp, app, config),
    media,
    seo: {
      title:
        app.seo?.title ??
        buildDefaultSeoTitle(name, iosApp, androidApp),
      description: seoDescription,
      canonical,
      ogImage: app.seo?.ogImage ?? media.icon ?? media.screenshots[0],
      keywords: keywords.length > 0 ? keywords : undefined,
      targetKeywords,
      relatedTerms,
      keywordIntro: app.seo?.keywordIntro,
      noindex: app.seo?.noindex,
    },
    features: app.features ?? [],
    valueProps: app.valueProps ?? [],
    faq: app.faq ?? [],
    links: app.links ?? {},
    hasIos: Boolean(iosApp),
    hasAndroid: Boolean(androidApp),
  };
}

async function fetchAllApps() {
  const config = loadAppsConfig();
  const apps = getEnabledApps(config);
  const statuses: FetchStatus[] = [];
  const errors: FetchStatus[] = [];

  await rm(DATA_DIR, { recursive: true, force: true });
  await mkdir(APP_DATA_DIR, { recursive: true });
  await mkdir(ASSETS_DIR, { recursive: true });

  for (const app of apps) {
    console.log(`Fetching ${app.slug}...`);

    try {
      const pageData = await buildPageData(config, app);
      const platforms: StorePlatform[] = [
        pageData.hasIos ? "ios" : undefined,
        pageData.hasAndroid ? "android" : undefined,
      ].filter((platform): platform is StorePlatform => Boolean(platform));

      await writeFile(
        join(APP_DATA_DIR, `${app.slug}.json`),
        `${JSON.stringify(pageData, null, 2)}\n`,
      );

      statuses.push({ slug: app.slug, status: "ok", platforms });
      console.log(`  ✓ ${app.slug} (${platforms.join(" + ")})`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const status = { slug: app.slug, status: "error", error: message } as const;
      statuses.push(status);
      errors.push(status);
      console.error(`  ✗ ${app.slug}: ${message}`);
    }
  }

  await writeFile(
    join(DATA_DIR, "manifest.json"),
    `${JSON.stringify(
      {
        fetchedAt: new Date().toISOString(),
        siteUrl: config.site.url,
        apps: statuses,
        errors,
      },
      null,
      2,
    )}\n`,
  );

  if (errors.length > 0) {
    throw new Error(`Fetch failed for ${errors.length} app(s)`);
  }
}

fetchAllApps().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
