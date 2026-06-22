import { LandingComponentsSmokeTest } from "@/components/dev/landing-components-smoke-test";
import { loadAllGeneratedApps } from "@/lib/app-data";
import { loadAppsConfig } from "@/lib/config";

export default function Home() {
  const config = loadAppsConfig();
  const [app] = loadAllGeneratedApps();

  return <LandingComponentsSmokeTest app={app} brandName={config.site.name} />;
}
