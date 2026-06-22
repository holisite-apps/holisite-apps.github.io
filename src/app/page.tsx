import { ShieldCheckIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadAppsConfig } from "@/lib/config";

export default function Home() {
  const config = loadAppsConfig();
  const home = config.site.home;
  const values = home?.values ?? [];

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
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-28">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8a6418]">
            Independent App Studio
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">
            {home?.headline ?? config.site.name}
          </h1>
          <p className="mt-6 max-w-2xl text-2xl leading-9 text-[#6d5c4a]">
            {home?.subheadline ?? config.site.description}
          </p>
          {home?.intro ? (
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#6d5c4a]">
              {home.intro}
            </p>
          ) : null}
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-[radial-gradient(circle_at_top,_rgba(201,162,39,0.28),_transparent_32rem)]" />
          <Card className="relative rounded-[2rem] border-[#e7d7bd] bg-white/80 shadow-xl">
            <CardHeader className="gap-5 p-8">
              <span className="grid size-12 place-items-center rounded-2xl bg-[#1d1712] text-white">
                <SparklesIcon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle className="text-2xl">
                  Thoughtfully built for daily routines
                </CardTitle>
                <CardDescription className="mt-3 text-base leading-7">
                  We focus on calm, useful mobile experiences for scripture,
                  reflection, and everyday tools.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {values.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <Card
                className="rounded-3xl border-[#e7d7bd] bg-white/70 shadow-sm"
                key={value.title}
              >
                <CardHeader>
                  <span className="mb-2 grid size-10 place-items-center rounded-2xl bg-[#f1e5d0] text-[#8a6418]">
                    <ShieldCheckIcon className="size-5" aria-hidden="true" />
                  </span>
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-[#6d5c4a] sm:px-6 lg:px-8">
        <div className="h-px bg-[#e7d7bd]" />
        <p>© {new Date().getFullYear()} {config.site.name}</p>
      </footer>
    </main>
  );
}
