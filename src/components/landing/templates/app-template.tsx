import {
  BibleTemplate,
  ShoppingTemplate,
  WomenBibleTemplate,
} from "@/components/landing/templates";
import type { GeneratedAppData } from "@/lib/app-data.schema";

export function AppTemplate({
  app,
  brandName,
}: {
  app: GeneratedAppData;
  brandName: string;
}) {
  switch (app.template) {
    case "bible":
      return <BibleTemplate app={app} brandName={brandName} />;
    case "women-bible":
      return <WomenBibleTemplate app={app} brandName={brandName} />;
    case "shopping":
      return <ShoppingTemplate app={app} brandName={brandName} />;
  }
}
