import Image from "next/image";

import {
  AppHeader,
  RatingDisplay,
  ScreenshotCarousel,
  StoreButtons,
} from "@/components/landing/shared";
import { Badge } from "@/components/ui/badge";
import {
  AboutSection,
  AppPageFooter,
  DownloadCta,
  FeatureGrid,
  JsonLd,
  SectionShell,
  buildSoftwareApplicationJsonLd,
  defaultBibleFeatures,
  defaultWomenBibleHighlights,
  type LandingTemplateProps,
} from "@/components/landing/templates/template-utils";

export function WomenBibleTemplate({ app, brandName }: LandingTemplateProps) {
  return (
    <div className="min-h-svh bg-[#fff8f5] text-[#26151b]">
      <JsonLd data={buildSoftwareApplicationJsonLd(app)} />
      <div className="bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_42rem)]">
        <AppHeader
          name={app.name}
          icon={app.media.icon}
          templateLabel="Women Bible"
          privacyUrl={app.links.privacy}
        />

        <main>
          <SectionShell className="flex flex-col items-center py-16 text-center lg:py-24">
            {app.media.icon ? (
              <Image
                className="size-28 rounded-[2rem] object-cover shadow-xl ring-1 ring-rose-200"
                src={app.media.icon}
                alt={`${app.name} icon`}
                width={112}
                height={112}
                priority
              />
            ) : null}
            <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
              {app.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#7b5b66]">
              {app.tagline}
            </p>
            <div className="mt-5">
              <RatingDisplay score={app.rating?.score} count={app.rating?.count} />
            </div>
            <StoreButtons
              className="mt-8"
              align="center"
              ios={app.stores.ios}
              android={app.stores.android}
            />
          </SectionShell>

          <SectionShell className="pb-10">
            <div className="flex flex-wrap justify-center gap-2">
              {defaultWomenBibleHighlights().map((highlight) => (
                <Badge
                  className="h-8 rounded-full bg-white/80 px-4 text-[#9f385e] ring-1 ring-rose-100"
                  key={highlight}
                  variant="secondary"
                >
                  {highlight}
                </Badge>
              ))}
            </div>
          </SectionShell>

          <ScreenshotCarousel
            appName={app.name}
            screenshots={app.media.screenshots}
          />

          <SectionShell className="py-14">
            <FeatureGrid
              features={defaultBibleFeatures(app).slice(0, 4)}
              variant="soft"
              className="md:grid-cols-2"
            />
          </SectionShell>

          <AboutSection app={app} className="max-w-3xl" compact />

          <DownloadCta
            app={app}
            title="Begin your journey today"
            description="Find scripture, devotion, and prayer in an app designed for daily encouragement."
            card
          />
        </main>

        <AppPageFooter app={app} brandName={brandName} />
      </div>
    </div>
  );
}
