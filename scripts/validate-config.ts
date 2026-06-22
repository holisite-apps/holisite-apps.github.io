#!/usr/bin/env npx tsx
import {
  AppsConfigError,
  getEnabledApps,
  loadAppsConfig,
} from "../src/lib/config";

function main() {
  try {
    const config = loadAppsConfig();
    const enabled = getEnabledApps(config);

    console.log("✓ apps.config.json is valid");
    console.log(`  Site: ${config.site.name} (${config.site.url})`);
    console.log(`  Templates: ${Object.keys(config.templates).join(", ")}`);
    console.log(
      `  Apps: ${config.apps.length} total, ${enabled.length} enabled`,
    );

    enabled.forEach((app) => {
      const platforms = [
        app.stores.ios ? "iOS" : null,
        app.stores.android ? "Android" : null,
      ]
        .filter(Boolean)
        .join(" + ");

      console.log(`    - ${app.slug} [${app.template}] (${platforms})`);
    });

    process.exit(0);
  } catch (error) {
    if (error instanceof AppsConfigError) {
      console.error(error.message);
      process.exit(1);
    }

    throw error;
  }
}

main();
