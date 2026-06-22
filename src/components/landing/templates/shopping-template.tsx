import Image from "next/image";
import { BellIcon, ListChecksIcon, WalletCardsIcon } from "lucide-react";

import {
  AppHeader,
  ScreenshotCarousel,
  StoreButtons,
} from "@/components/landing/shared";
import { Badge } from "@/components/ui/badge";
import {
  AboutSection,
  AppPageFooter,
  DownloadCta,
  FaqSection,
  FeatureGrid,
  JsonLd,
  SectionShell,
  SeoKeywordSection,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildSoftwareApplicationJsonLd,
  defaultShoppingValueProps,
  getAppFaq,
  type LandingTemplateProps,
} from "@/components/landing/templates/template-utils";

export function ShoppingTemplate({ app, brandName }: LandingTemplateProps) {
  const valueProps = defaultShoppingValueProps(app);
  const heroScreenshot = app.media.screenshots[0];
  const faqItems = getAppFaq(app);

  return (
    <div className="min-h-svh bg-white text-zinc-950">
      <JsonLd data={buildSoftwareApplicationJsonLd(app)} />
      <JsonLd data={buildBreadcrumbJsonLd(app)} />
      <JsonLd data={buildFaqPageJsonLd(faqItems)} />
      <AppHeader
        name={app.name}
        icon={app.media.icon}
        templateLabel="Shopping"
        privacyUrl={app.links.privacy}
      />

      <main>
        <SectionShell className="grid gap-10 py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <Badge className="bg-emerald-100 text-emerald-800" variant="secondary">
              Shopping Sheet
            </Badge>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
              {app.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              {app.tagline}
            </p>
            <ul className="mt-6 space-y-3 text-sm font-medium">
              {valueProps.slice(0, 3).map((value) => (
                <li className="flex items-center gap-3" key={value.title}>
                  <span className="grid size-7 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <ListChecksIcon className="size-4" aria-hidden="true" />
                  </span>
                  {value.title}
                </li>
              ))}
            </ul>
            <StoreButtons
              className="mt-8"
              ios={app.stores.ios}
              android={app.stores.android}
            />
          </div>

          {heroScreenshot ? (
            <div className="justify-self-center rounded-[2rem] bg-zinc-950 p-2 shadow-2xl">
              <Image
                className="h-[560px] w-auto rounded-[1.5rem] object-cover"
                src={heroScreenshot}
                alt={`${app.name} screenshot 1`}
                width={280}
                height={560}
                priority
              />
            </div>
          ) : null}
        </SectionShell>

        <SectionShell className="py-12">
          <div className="grid gap-4 md:grid-cols-3">
            {[WalletCardsIcon, ListChecksIcon, BellIcon].map((Icon, index) => {
              const value = valueProps[index];

              return (
                <div className="rounded-2xl border bg-zinc-50 p-6" key={value.title}>
                  <Icon className="size-6 text-emerald-600" aria-hidden="true" />
                  <h2 className="mt-4 text-lg font-semibold">{value.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </SectionShell>

        <ScreenshotCarousel appName={app.name} screenshots={app.media.screenshots} />

        <SectionShell className="py-14">
          <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
          <FeatureGrid
            className="mt-6"
            variant="shopping"
            features={[
              { title: "Install", description: "Download from the official app store." },
              { title: "Organize", description: "Create or review your shopping sheets." },
              { title: "Save", description: "Track what matters before you buy." },
            ]}
          />
        </SectionShell>

        <AboutSection app={app} compact />

        <SeoKeywordSection
          app={app}
          title={`Shopping workflows related to ${app.name}`}
          eyebrow="Shopping agent searches"
          variant="shopping"
        />

        <FaqSection items={faqItems} />

        <DownloadCta
          app={app}
          title={`Get ${app.name}`}
          description="Download from the official app stores and start organizing your shopping workflow."
          className="bg-emerald-600"
        />
      </main>

      <AppPageFooter app={app} brandName={brandName} />
    </div>
  );
}
