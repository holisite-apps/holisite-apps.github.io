import Image from "next/image";

import { cn } from "@/lib/utils";

export type ScreenshotCarouselProps = {
  appName: string;
  screenshots: string[];
  className?: string;
};

export function ScreenshotCarousel({
  appName,
  screenshots,
  className,
}: ScreenshotCarouselProps) {
  if (screenshots.length === 0) {
    return null;
  }

  return (
    <section className={cn("w-full", className)} aria-labelledby="screenshots">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Screenshots
            </p>
            <h2 id="screenshots" className="mt-2 text-2xl font-semibold tracking-tight">
              See {appName} in action
            </h2>
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Swipe or scroll
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 [scrollbar-width:thin]">
        <div className="mx-auto flex max-w-6xl gap-4 px-4 sm:px-6 lg:px-8">
          {screenshots.map((screenshot, index) => (
            <figure
              className="shrink-0 rounded-[2rem] bg-zinc-950 p-2 shadow-xl ring-1 ring-foreground/10"
              key={screenshot}
            >
              <Image
                className="h-[520px] w-auto rounded-[1.45rem] object-cover"
                src={screenshot}
                alt={`${appName} screenshot ${index + 1}`}
                width={260}
                height={520}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
