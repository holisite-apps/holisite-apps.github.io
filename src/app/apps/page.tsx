import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  HeartIcon,
  ShoppingBagIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadAllGeneratedApps } from "@/lib/app-data";
import { loadAppsConfig } from "@/lib/config";
import type { GeneratedAppData } from "@/lib/app-data.schema";

const templateMeta = {
  bible: {
    label: "Bible",
    icon: BookOpenIcon,
    accent: "bg-[#f1e5d0] text-[#8a6418]",
  },
  "women-bible": {
    label: "Women Bible",
    icon: HeartIcon,
    accent: "bg-[#f7dfe8] text-[#a04362]",
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingBagIcon,
    accent: "bg-[#dff2e4] text-[#267447]",
  },
} satisfies Record<
  GeneratedAppData["template"],
  {
    label: string;
    icon: typeof BookOpenIcon;
    accent: string;
  }
>;

export function generateMetadata(): Metadata {
  const config = loadAppsConfig();

  return {
    title: `Apps - ${config.site.name}`,
    description: `Explore ${config.site.name} apps for Bible study, devotion, shopping lists, and everyday mobile workflows.`,
    alternates: {
      canonical: `${config.site.url}/apps/`,
    },
    openGraph: {
      title: `Apps - ${config.site.name}`,
      description: `Explore ${config.site.name} mobile apps on iOS and Android.`,
      url: `${config.site.url}/apps/`,
      siteName: config.site.name,
      type: "website",
    },
  };
}

function getPlatformLabel(app: GeneratedAppData) {
  if (app.hasIos && app.hasAndroid) {
    return "iOS + Android";
  }

  return app.hasIos ? "iOS" : "Android";
}

export default function AppsPage() {
  const config = loadAppsConfig();
  const apps = loadAllGeneratedApps().sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <main className="min-h-svh bg-[#fbf7ef] text-[#1d1712]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#1d1712] text-sm font-semibold text-white">
            {config.site.name.slice(0, 1)}
          </span>
          <span className="text-sm font-semibold tracking-tight">
            {config.site.name}
          </span>
        </Link>
        <Link
          className="rounded-full border border-[#d8c5a8] bg-white/70 px-4 py-2 text-sm font-semibold text-[#4b3a2b] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
          href="/"
        >
          Home
        </Link>
      </header>

      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pb-16 lg:pt-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8a6418]">
            App Directory
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
            Explore apps by {config.site.name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#6d5c4a] sm:text-xl">
            A curated index of Bible study, devotion, and shopping workflow
            apps with direct links to each product page.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {apps.map((app) => {
            const meta = templateMeta[app.template];
            const Icon = meta.icon;

            return (
              <Card
                className="group rounded-[2rem] border-[#e7d7bd] bg-white/75 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                key={app.slug}
              >
                <CardHeader className="gap-5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {app.media.icon ? (
                        <Image
                          alt={`${app.name} icon`}
                          className="size-16 rounded-2xl border border-[#eadcc5] object-cover shadow-sm"
                          height={64}
                          src={app.media.icon}
                          width={64}
                        />
                      ) : (
                        <span className="grid size-16 place-items-center rounded-2xl bg-[#1d1712] text-xl font-semibold text-white">
                          {app.name.slice(0, 1)}
                        </span>
                      )}
                      <span
                        className={`grid size-10 place-items-center rounded-2xl ${meta.accent}`}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                    </div>
                    <ArrowUpRightIcon
                      className="size-5 text-[#b39870] transition group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <Badge
                        className="bg-[#f1e5d0] text-[#8a6418]"
                        variant="secondary"
                      >
                        {meta.label}
                      </Badge>
                      <Badge variant="outline">{getPlatformLabel(app)}</Badge>
                    </div>
                    <CardTitle className="text-2xl tracking-tight">
                      <Link href={`/apps/${app.slug}/`}>{app.name}</Link>
                    </CardTitle>
                    <CardDescription className="mt-3 line-clamp-3 text-base leading-7 text-[#6d5c4a]">
                      {app.tagline || app.seo.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <Link
                    className="inline-flex items-center gap-2 rounded-full bg-[#1d1712] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#3a2b20]"
                    href={`/apps/${app.slug}/`}
                  >
                    View landing page
                    <ArrowUpRightIcon className="size-4" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-[#6d5c4a] sm:px-6 lg:px-8">
        <div className="h-px bg-[#e7d7bd]" />
        <p>
          © {new Date().getFullYear()} {config.site.name}
        </p>
      </footer>
    </main>
  );
}
