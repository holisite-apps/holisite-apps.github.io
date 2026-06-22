import {
  BibleTemplate,
  ShoppingTemplate,
  WomenBibleTemplate,
} from "@/components/landing/templates";
import type { GeneratedAppData } from "@/lib/app-data.schema";

export function AppTemplate({
  app,
  brandName,
  relatedApps,
}: {
  app: GeneratedAppData;
  brandName: string;
  relatedApps: GeneratedAppData[];
}) {
  switch (app.template) {
    case "bible":
      return (
        <BibleTemplate
          app={app}
          brandName={brandName}
          relatedApps={relatedApps}
        />
      );
    case "women-bible":
      return (
        <WomenBibleTemplate
          app={app}
          brandName={brandName}
          relatedApps={relatedApps}
        />
      );
    case "shopping":
      return (
        <ShoppingTemplate
          app={app}
          brandName={brandName}
          relatedApps={relatedApps}
        />
      );
  }
}
