import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  appsConfigSchema,
  type AppConfig,
  type AppsConfig,
} from "@/lib/config.schema";

export const APPS_CONFIG_FILENAME = "apps.config.json";

export class AppsConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppsConfigError";
  }
}

export function loadAppsConfigRaw(cwd = process.cwd()): unknown {
  const configPath = join(cwd, APPS_CONFIG_FILENAME);

  try {
    const contents = readFileSync(configPath, "utf-8");
    return JSON.parse(contents) as unknown;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      throw new AppsConfigError(
        `Missing ${APPS_CONFIG_FILENAME} at ${configPath}. Create it from docs/APPS_CONFIG.md.`,
      );
    }

    if (error instanceof SyntaxError) {
      throw new AppsConfigError(
        `Invalid JSON in ${APPS_CONFIG_FILENAME}: ${error.message}`,
      );
    }

    throw error;
  }
}

export function parseAppsConfig(raw: unknown): AppsConfig {
  const result = appsConfigSchema.safeParse(raw);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
        return `  - ${path}: ${issue.message}`;
      })
      .join("\n");

    throw new AppsConfigError(`apps.config.json validation failed:\n${details}`);
  }

  return result.data;
}

export function loadAppsConfig(cwd = process.cwd()): AppsConfig {
  return parseAppsConfig(loadAppsConfigRaw(cwd));
}

export function getEnabledApps(config: AppsConfig): AppConfig[] {
  return config.apps.filter((app) => app.enabled !== false);
}

export function getAppBySlug(
  config: AppsConfig,
  slug: string,
): AppConfig | undefined {
  return config.apps.find((app) => app.slug === slug);
}

export function getAppPagePath(slug: string): string {
  return `/apps/${slug}/`;
}

export function getAppCanonicalUrl(config: AppsConfig, slug: string): string {
  const app = getAppBySlug(config, slug);
  const canonical = app?.seo?.canonical;

  if (canonical) {
    return canonical.endsWith("/") ? canonical : `${canonical}/`;
  }

  return `${config.site.url}${getAppPagePath(slug)}`;
}
