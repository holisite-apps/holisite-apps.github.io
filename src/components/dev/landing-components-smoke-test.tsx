import {
  AppFooter,
  AppHeader,
  RatingDisplay,
  ScreenshotCarousel,
  StoreButtons,
} from "@/components/landing/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GeneratedAppData } from "@/lib/app-data.schema";

export function LandingComponentsSmokeTest({
  app,
  brandName,
}: {
  app: GeneratedAppData;
  brandName: string;
}) {
  return (
    <div className="w-full bg-background">
      <AppHeader
        name={app.name}
        icon={app.media.icon}
        templateLabel={app.template}
        privacyUrl={app.links.privacy}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Landing shared components</CardTitle>
            <CardDescription>
              Task 7 smoke test using generated store data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{app.name}</h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">{app.tagline}</p>
            </div>

            <RatingDisplay
              score={app.rating?.score}
              count={app.rating?.count}
            />

            <div className="space-y-3">
              <p className="text-sm font-medium">Dual/single platform buttons</p>
              <StoreButtons ios={app.stores.ios} android={app.stores.android} />
              <StoreButtons ios={app.stores.ios} align="start" />
              <StoreButtons android={app.stores.android} align="start" />
            </div>
          </CardContent>
        </Card>
      </main>

      <ScreenshotCarousel appName={app.name} screenshots={app.media.screenshots} />

      <AppFooter
        brandName={brandName}
        developer={app.developer}
        privacyUrl={app.links.privacy}
        termsUrl={app.links.terms}
        supportUrl={app.links.support}
        websiteUrl={app.links.website}
      />
    </div>
  );
}
