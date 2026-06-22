import type { ReactNode } from "react";
import { BookOpenIcon, CheckCircle2Icon, HeartIcon, ShieldIcon } from "lucide-react";

import { AppFooter, StoreButtons } from "@/components/landing/shared";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GeneratedAppData } from "@/lib/app-data.schema";
import { cn } from "@/lib/utils";

export type LandingTemplateProps = {
  app: GeneratedAppData;
  brandName: string;
};

export type Feature = {
  title: string;
  description: string;
};

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
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
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

export function SectionShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}
