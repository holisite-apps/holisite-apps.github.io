import Image from "next/image";

import {
  AppHeader,
  RatingDisplay,
  ScreenshotCarousel,
  StoreButtons,
} from "@/components/landing/shared";
import {
  AboutSection,
  AppPageFooter,
  DownloadCta,
  FeatureGrid,
  JsonLd,
  SectionShell,
  SeoKeywordSection,
  buildSoftwareApplicationJsonLd,
  defaultBibleFeatures,
  formatDate,
  type LandingTemplateProps,
} from "@/components/landing/templates/template-utils";

export function BibleTemplate({ app, brandName }: LandingTemplateProps) {
  const updated = formatDate(app.updatedAt);

  return (
    <div className="min-h-svh bg-[#fbf7ef] text-[#1d1712]">
      <JsonLd data={buildSoftwareApplicationJsonLd(app)} />
      <AppHeader
        name={app.name}
        icon={app.media.icon}
        templateLabel={app.category ?? "Bible"}
        privacyUrl={app.links.privacy}
      />

      <main>
        <SectionShell className="grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8a6418]">
              Bible Study App
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
              {app.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6d5c4a]">
              {app.tagline}
            </p>
            <div className="mt-6">
              <RatingDisplay score={app.rating?.score} count={app.rating?.count} />
            </div>
            <StoreButtons
              className="mt-8"
              ios={app.stores.ios}
              android={app.stores.android}
            />
          </div>

          <div className="justify-self-center">
            <div className="rounded-[2rem] bg-[#16110d] p-6 shadow-2xl ring-1 ring-black/10">
              {app.media.icon ? (
                <Image
                  className="size-48 rounded-[1.5rem] object-cover shadow-lg"
                  src={app.media.icon}
                  alt={`${app.name} icon`}
                  width={192}
                  height={192}
                  priority
                />
              ) : null}
            </div>
          </div>
        </SectionShell>

        <ScreenshotCarousel appName={app.name} screenshots={app.media.screenshots} />

        <SectionShell className="py-14">
          <FeatureGrid features={defaultBibleFeatures(app)} />
        </SectionShell>

        <AboutSection app={app} />

        <SeoKeywordSection
          app={app}
          title={`Bible study topics for ${app.name}`}
          eyebrow="Scripture searches"
        />

        <SectionShell className="py-8">
          <div className="rounded-2xl border border-[#d9c7ad] bg-white/60 p-5 text-sm text-[#6d5c4a]">
            <span className="font-semibold text-[#1d1712]">Trusted details:</span>{" "}
            {app.rating ? `${app.rating.score.toFixed(1)} rating` : "Rating available soon"}
            {app.version ? ` · Version ${app.version}` : ""}
            {updated ? ` · Updated ${updated}` : ""}
          </div>
        </SectionShell>

        <DownloadCta
          app={app}
          title="Start your daily reading today"
          description="Download from the official app stores and keep scripture close throughout the day."
        />
      </main>

      <AppPageFooter app={app} brandName={brandName} />
    </div>
  );
}
