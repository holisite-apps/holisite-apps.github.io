import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  generatedAppDataSchema,
  manifestSchema,
  type FetchManifest,
  type GeneratedAppData,
} from "@/lib/app-data.schema";

export const DATA_DIR = "data";
export const APP_DATA_DIR = join(DATA_DIR, "apps");
export const MANIFEST_PATH = join(DATA_DIR, "manifest.json");

export class AppDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppDataError";
  }
}

function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as unknown;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      throw new AppDataError(
        `Missing generated data file: ${path}. Run "npm run fetch" before building.`,
      );
    }

    if (error instanceof SyntaxError) {
      throw new AppDataError(`Invalid JSON in generated data file ${path}.`);
    }

    throw error;
  }
}

export function hasGeneratedData(cwd = process.cwd()): boolean {
  return existsSync(join(cwd, MANIFEST_PATH)) && existsSync(join(cwd, APP_DATA_DIR));
}

export function loadAppManifest(cwd = process.cwd()): FetchManifest {
  const path = join(cwd, MANIFEST_PATH);
  const result = manifestSchema.safeParse(readJson(path));

  if (!result.success) {
    throw new AppDataError(
      `Invalid ${MANIFEST_PATH}. Run "npm run fetch" again.\n${result.error.message}`,
    );
  }

  return result.data;
}

export function loadGeneratedAppData(
  slug: string,
  cwd = process.cwd(),
): GeneratedAppData {
  const path = join(cwd, APP_DATA_DIR, `${slug}.json`);
  const result = generatedAppDataSchema.safeParse(readJson(path));

  if (!result.success) {
    throw new AppDataError(
      `Invalid generated app data for "${slug}". Run "npm run fetch" again.\n${result.error.message}`,
    );
  }

  return result.data;
}

export function getGeneratedAppSlugs(cwd = process.cwd()): string[] {
  const manifest = loadAppManifest(cwd);

  return manifest.apps
    .filter((app) => app.status === "ok")
    .map((app) => app.slug)
    .sort();
}

export function loadAllGeneratedApps(cwd = process.cwd()): GeneratedAppData[] {
  return getGeneratedAppSlugs(cwd).map((slug) =>
    loadGeneratedAppData(slug, cwd),
  );
}
