import { cn } from "@/lib/utils";

type StoreButtonLink = {
  url: string;
};

export type StoreButtonsProps = {
  ios?: StoreButtonLink;
  android?: StoreButtonLink;
  className?: string;
  align?: "start" | "center";
};

function StoreBadge({
  href,
  eyebrow,
  label,
}: {
  href: string;
  eyebrow: string;
  label: string;
}) {
  return (
    <a
      className="inline-flex min-h-12 min-w-40 items-center justify-center rounded-xl bg-zinc-950 px-4 py-2 text-left text-white shadow-sm ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="grid gap-0.5 leading-none">
        <span className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/70">
          {eyebrow}
        </span>
        <span className="text-sm font-semibold tracking-tight">{label}</span>
      </span>
    </a>
  );
}

export function StoreButtons({
  ios,
  android,
  className,
  align = "start",
}: StoreButtonsProps) {
  if (!ios && !android) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-3",
        align === "center" && "justify-center",
        className,
      )}
      aria-label="Download options"
    >
      {ios ? (
        <StoreBadge
          href={ios.url}
          eyebrow="Download on the"
          label="App Store"
        />
      ) : null}
      {android ? (
        <StoreBadge
          href={android.url}
          eyebrow="Get it on"
          label="Google Play"
        />
      ) : null}
    </div>
  );
}
