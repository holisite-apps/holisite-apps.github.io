#!/usr/bin/env npx tsx
import {
  AppDataError,
  hasGeneratedData,
  loadAllGeneratedApps,
  loadAppManifest,
} from "../src/lib/app-data";

function main() {
  try {
    if (!hasGeneratedData()) {
      throw new AppDataError(
        'Missing generated store data. Run "npm run fetch" before "npm run build".',
      );
    }

    const manifest = loadAppManifest();
    const apps = loadAllGeneratedApps();

    if (manifest.errors.length > 0) {
      throw new AppDataError(
        `Generated data contains ${manifest.errors.length} fetch error(s). Run "npm run fetch" again.`,
      );
    }

    if (apps.length === 0) {
      throw new AppDataError(
        'No generated app data found. Run "npm run fetch" before building.',
      );
    }

    console.log(
      `✓ generated data is ready (${apps.length} apps, fetched ${manifest.fetchedAt})`,
    );
  } catch (error) {
    if (error instanceof AppDataError) {
      console.error(error.message);
      process.exit(1);
    }

    throw error;
  }
}

main();
