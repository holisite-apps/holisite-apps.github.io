import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  HeartIcon,
  ShieldIcon,
  TagsIcon,
} from "lucide-react";

import { AppFooter, StoreButtons } from "@/components/landing/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { GeneratedAppData } from "@/lib/app-data.schema";
import { cn } from "@/lib/utils";

export type LandingTemplateProps = {
  app: GeneratedAppData;
  brandName: string;
  relatedApps: GeneratedAppData[];
};

export type Feature = {
  title: string;
  description: string;
};

export type AppFaqItem = {
  question: string;
  answer: string;
};

function getPlatformText(app: GeneratedAppData): string {
  if (app.hasIos && app.hasAndroid) {
    return "iPhone, iPad, and Android devices";
  }

  return app.hasIos ? "iPhone and iPad" : "Android devices";
}

function getStoreText(app: GeneratedAppData): string {
  if (app.hasIos && app.hasAndroid) {
    return "the App Store and Google Play";
  }

  return app.hasIos ? "the App Store" : "Google Play";
}

function getPrimaryTerms(app: GeneratedAppData, count = 3): string[] {
  return uniqueTerms([
    ...app.seo.targetKeywords,
    ...app.seo.relatedTerms,
    ...(app.seo.keywords ?? []),
  ]).slice(0, count);
}

export function defaultAppFaq(app: GeneratedAppData): AppFaqItem[] {
  const storeText = getStoreText(app);
  const platformText = getPlatformText(app);
  const [primaryTerm, secondaryTerm] = getPrimaryTerms(app, 2);

  if (app.template === "shopping") {
    return [
      {
        question: `What is ${app.name} used for?`,
        answer: `${app.name} helps users discover products, save links, organize shopping finds, and manage product lists in a cleaner workflow${primaryTerm ? ` for ${primaryTerm}` : ""}.`,
      },
      {
        question: `Can ${app.name} help with ${secondaryTerm ?? "shopping agent workflows"}?`,
        answer: `${app.name} is designed for product discovery, saved links, product lists, and spreadsheet-style organization across related shopping workflows.`,
      },
      {
        question: `Where can I download ${app.name}?`,
        answer: `${app.name} is available for ${platformText}. Use the official download button on this page to open ${storeText}. Purchases are completed externally through the relevant shopping or marketplace workflow.`,
      },
    ];
  }

  return [
    {
      question: `What is ${app.name}?`,
      answer: `${app.name} is a Bible app designed for scripture reading, daily devotion, prayer, and focused Bible study${primaryTerm ? `, including ${primaryTerm}` : ""}.`,
    },
    {
      question: `Does ${app.name} support ${secondaryTerm ?? "daily devotionals"}?`,
      answer: `${app.name} focuses on daily scripture, prayer, devotional reading, and Bible study routines for ${platformText}.`,
    },
    {
      question: `Where can I download ${app.name}?`,
      answer: `${app.name} is published by ${app.developer ?? "Holisite"} and is available through ${storeText}. This landing page links to the official app store listing for download.`,
    },
  ];
}

export function getAppFaq(app: GeneratedAppData): AppFaqItem[] {
  return app.faq.length > 0 ? app.faq : defaultAppFaq(app);
}

export function formatDate(date?: string): string | undefined {
  if (!date) {
    return undefined;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function defaultBibleFeatures(app: GeneratedAppData): Feature[] {
  if (app.features.length > 0) {
    return app.features;
  }

  return [
    {
      title: "Daily Scripture",
      description: "Read and reflect on verses that support a steady Bible habit.",
    },
    {
      title: "Offline Reading",
      description: "Keep scripture close for quiet moments, travel, and daily devotion.",
    },
    {
      title: "Study With Focus",
      description: "A clear reading experience designed for prayer, study, and reflection.",
    },
  ];
}

export function defaultWomenBibleHighlights(): string[] {
  return ["Devotion", "Prayer", "Daily Scripture"];
}

export function defaultShoppingValueProps(app: GeneratedAppData): Feature[] {
  const defaults = [
    {
      title: "Save Money",
      description: "Track deals and shopping ideas in one place.",
    },
    {
      title: "Organize Faster",
      description: "Keep lists, sheets, and product notes easy to review.",
    },
    {
      title: "Shop Smarter",
      description: "Move from browsing to buying with a cleaner workflow.",
    },
  ];

  if (app.valueProps.length === 0) {
    return defaults;
  }

  return [...app.valueProps, ...defaults].slice(0, 3);
}

export function FeatureGrid({
  features,
  className,
  variant = "default",
}: {
  features: Feature[];
  className?: string;
  variant?: "default" | "soft" | "shopping";
}) {
  const icons = [BookOpenIcon, HeartIcon, CheckCircle2Icon, ShieldIcon];

  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      {features.map((feature, index) => {
        const Icon = icons[index % icons.length];

        return (
          <Card
            className={cn(
              "border-foreground/10 bg-background/80 shadow-sm",
              variant === "soft" && "rounded-3xl bg-white/70",
              variant === "shopping" && "rounded-2xl bg-white",
            )}
            key={feature.title}
          >
            <CardHeader>
              <span className="mb-3 grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}

export function AboutSection({
  app,
  className,
  compact = false,
}: {
  app: GeneratedAppData;
  className?: string;
  compact?: boolean;
}) {
  const paragraphs = app.description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .slice(0, compact ? 2 : 5);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <section className={cn("mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 lg:px-8", className)}>
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
        About
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">About {app.name}</h2>
      <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
        {paragraphs.map((paragraph) => (
          <p className="whitespace-pre-line" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function buildIntentFeatures(app: GeneratedAppData): Feature[] {
  const [primaryTerm, secondaryTerm, tertiaryTerm] = getPrimaryTerms(app, 3);
  const platformText = getPlatformText(app);

  if (app.template === "shopping") {
    return [
      {
        title: `Organize ${primaryTerm ?? "shopping finds"}`,
        description: `${app.name} gives product research a clearer place to live, from saved product links to collections and spreadsheet-style lists.`,
      },
      {
        title: `Support ${secondaryTerm ?? "shopping agent workflows"}`,
        description: `Use ${app.name} to keep related finds, product notes, and marketplace links easier to review before you buy.`,
      },
      {
        title: `Review product lists on ${platformText}`,
        description: `${app.name} is built for ${platformText}, so you can revisit shopping ideas and product discovery lists when you need them.`,
      },
    ];
  }

  if (app.template === "women-bible") {
    return [
      {
        title: `Daily rhythm for ${primaryTerm ?? "women's Bible study"}`,
        description: `${app.name} helps women build a steady scripture habit with devotional reading, prayer, and reflection in one place.`,
      },
      {
        title: `Prayer and study for real life`,
        description: `Use ${app.name} for daily scripture, ${secondaryTerm ?? "prayer plans"}, Bible notes, and quiet moments of encouragement.`,
      },
      {
        title: `Available on ${platformText}`,
        description: `${app.name} links directly to ${getStoreText(app)}, helping readers start with the official app listing.`,
      },
    ];
  }

  return [
    {
      title: `Focused ${primaryTerm ?? "Bible study"}`,
      description: `${app.name} supports scripture reading, devotional reflection, and a simpler Bible study routine.`,
    },
    {
      title: `Built for ${secondaryTerm ?? "daily Bible reading"}`,
      description: `Read, reflect, and return to scripture with features designed around ${tertiaryTerm ?? "offline Bible access"} and daily faith habits.`,
    },
    {
      title: `Download on ${platformText}`,
      description: `${app.name} is available through ${getStoreText(app)} with official store links on this page.`,
    },
  ];
}

export function AppIntentSection({
  app,
  title,
  eyebrow = "Use cases",
  variant = "default",
}: {
  app: GeneratedAppData;
  title: string;
  eyebrow?: string;
  variant?: "default" | "soft" | "shopping";
}) {
  return (
    <SectionShell className="py-14">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          {app.seo.description}
        </p>
      </div>
      <FeatureGrid
        className="mt-7"
        features={buildIntentFeatures(app)}
        variant={variant}
      />
    </SectionShell>
  );
}

function getTemplateLabel(template: GeneratedAppData["template"]): string {
  switch (template) {
    case "bible":
      return "Bible";
    case "women-bible":
      return "Women Bible";
    case "shopping":
      return "Shopping";
  }
}

export function RelatedAppsSection({
  apps,
  title,
  className,
}: {
  apps: GeneratedAppData[];
  title: string;
  className?: string;
}) {
  if (apps.length === 0) {
    return null;
  }

  return (
    <SectionShell className={cn("py-14", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Related apps
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
        </div>
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          href="/apps/"
        >
          View all apps
          <ArrowUpRightIcon className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {apps.map((app) => (
          <Link
            className="group rounded-3xl border border-foreground/10 bg-white/75 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
            href={`/apps/${app.slug}/`}
            key={app.slug}
          >
            <div className="flex items-start gap-4">
              {app.media.icon ? (
                <Image
                  alt={`${app.name} icon`}
                  className="size-14 rounded-2xl object-cover shadow-sm ring-1 ring-foreground/10"
                  height={56}
                  src={app.media.icon}
                  width={56}
                />
              ) : (
                <span className="grid size-14 place-items-center rounded-2xl bg-foreground text-background">
                  {app.name.slice(0, 1)}
                </span>
              )}
              <div className="min-w-0">
                <Badge variant="secondary">{getTemplateLabel(app.template)}</Badge>
                <h3 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-primary">
                  {app.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {app.seo.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}

export function SeoKeywordSection({
  app,
  title,
  eyebrow = "Related searches",
  className,
  variant = "default",
}: {
  app: GeneratedAppData;
  title: string;
  eyebrow?: string;
  className?: string;
  variant?: "default" | "soft" | "shopping";
}) {
  const terms = uniqueTerms([
    ...app.seo.targetKeywords,
    ...app.seo.relatedTerms,
  ]);

  if (terms.length === 0 && !app.seo.keywordIntro) {
    return null;
  }

  return (
    <section
      className={cn(
        "mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8",
        className,
      )}
    >
      <Card
        className={cn(
          "rounded-[2rem] border-foreground/10 bg-white/75 shadow-sm",
          variant === "soft" && "border-rose-100 bg-white/70",
          variant === "shopping" && "border-emerald-100 bg-emerald-50/60",
        )}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary",
                variant === "soft" && "bg-rose-100 text-rose-700",
                variant === "shopping" && "bg-emerald-100 text-emerald-700",
              )}
            >
              <TagsIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {eyebrow}
              </p>
              <CardTitle className="mt-1 text-2xl">{title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {app.seo.keywordIntro ? (
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              {app.seo.keywordIntro}
            </p>
          ) : null}
          {terms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {terms.map((term) => (
                <Badge
                  className={cn(
                    "rounded-full px-3 py-1",
                    variant === "shopping" &&
                      "bg-white text-emerald-800 ring-1 ring-emerald-100",
                    variant === "soft" &&
                      "bg-white text-rose-800 ring-1 ring-rose-100",
                  )}
                  key={term}
                  variant={variant === "default" ? "secondary" : "outline"}
                >
                  {term}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}

export function DownloadCta({
  app,
  title,
  description,
  className,
  card = false,
}: {
  app: GeneratedAppData;
  title: string;
  description: string;
  className?: string;
  card?: boolean;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div
        className={cn(
          "rounded-[2rem] bg-zinc-950 p-8 text-white shadow-2xl sm:p-10",
          card && "bg-white text-foreground ring-1 ring-foreground/10",
          className,
        )}
      >
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
            <p className={cn("mt-3 max-w-2xl text-white/70", card && "text-muted-foreground")}>
              {description}
            </p>
          </div>
          <StoreButtons ios={app.stores.ios} android={app.stores.android} />
        </div>
      </div>
    </section>
  );
}

export function AppPageFooter({
  app,
  brandName,
}: {
  app: GeneratedAppData;
  brandName: string;
}) {
  return (
    <AppFooter
      brandName={brandName}
      developer={app.developer}
      privacyUrl={app.links.privacy}
      termsUrl={app.links.terms}
      supportUrl={app.links.support}
      websiteUrl={app.links.website}
    />
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function FaqSection({
  items,
  title = "FAQ",
  className,
}: {
  items: AppFaqItem[];
  title?: string;
  className?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <SectionShell className={cn("py-14", className)}>
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      <Accordion className="mt-6 rounded-2xl border p-4">
        {items.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionShell>
  );
}

export function buildSoftwareApplicationJsonLd(app: GeneratedAppData) {
  const downloadUrls = [app.stores.ios?.url, app.stores.android?.url].filter(
    (url): url is string => Boolean(url),
  );

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.seo.description || app.tagline,
    applicationCategory: app.category,
    operatingSystem: [
      app.hasIos ? "iOS" : undefined,
      app.hasAndroid ? "Android" : undefined,
    ].filter(Boolean),
    image: app.media.icon,
    screenshot: app.media.screenshots,
    downloadUrl: downloadUrls,
    softwareVersion: app.version,
    author: app.developer
      ? {
          "@type": "Organization",
          name: app.developer,
        }
      : undefined,
    aggregateRating: app.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: app.rating.score,
          ratingCount: app.rating.count,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function buildBreadcrumbJsonLd(app: GeneratedAppData) {
  const canonical = new URL(app.seo.canonical);
  const appsUrl = new URL("/apps/", canonical.origin);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: canonical.origin,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Apps",
        item: appsUrl.toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: app.name,
        item: app.seo.canonical,
      },
    ],
  };
}

export function buildFaqPageJsonLd(items: AppFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function uniqueTerms(terms: string[]): string[] {
  return [...new Set(terms.map((term) => term.trim()).filter(Boolean))];
}

export function SectionShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}
