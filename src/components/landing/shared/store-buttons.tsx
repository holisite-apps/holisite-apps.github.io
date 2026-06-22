import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StoreButtonLink = {
  url: string;
};

type StoreIconProps = {
  className?: string;
};

export type StoreButtonsProps = {
  ios?: StoreButtonLink;
  android?: StoreButtonLink;
  className?: string;
  align?: "start" | "center";
};

function AppleIcon({ className }: StoreIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.05 12.52c-.03-2.92 2.39-4.32 2.5-4.39-1.36-1.99-3.47-2.26-4.22-2.29-1.8-.18-3.51 1.06-4.42 1.06-.91 0-2.32-1.03-3.81-1-1.96.03-3.76 1.14-4.77 2.89-2.04 3.54-.52 8.78 1.47 11.65.97 1.41 2.13 2.99 3.66 2.94 1.47-.06 2.02-.95 3.79-.95 1.77 0 2.27.95 3.82.92 1.58-.03 2.58-1.43 3.55-2.84 1.12-1.63 1.58-3.21 1.61-3.29-.04-.02-3.14-1.2-3.18-4.7Zm-2.9-8.57c.81-.98 1.36-2.34 1.21-3.7-1.17.05-2.59.78-3.43 1.76-.75.87-1.41 2.25-1.23 3.58 1.31.1 2.64-.66 3.45-1.64Z" />
    </svg>
  );
}

function GooglePlayIcon({ className }: StoreIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M4.25 2.65c-.32.35-.5.88-.5 1.58v15.54c0 .7.18 1.23.5 1.58l.08.07 8.7-8.7v-.44l-8.7-8.7-.08.07Z"
        fill="#34A853"
      />
      <path
        d="m15.92 15.63-2.89-2.89v-.48l2.89-2.89.07.04 3.43 1.95c.98.56.98 1.48 0 2.04l-3.43 1.95-.07.04Z"
        fill="#FBBC04"
      />
      <path
        d="m15.99 15.35-2.96-2.96-8.78 8.78c.5.53 1.32.59 2.25.06l9.49-5.88Z"
        fill="#EA4335"
      />
      <path
        d="M15.99 9.65 6.5 3.77c-.93-.53-1.75-.47-2.25.06l8.78 8.78 2.96-2.96Z"
        fill="#4285F4"
      />
    </svg>
  );
}

function StoreBadge({
  href,
  eyebrow,
  label,
  icon,
}: {
  href: string;
  eyebrow: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <a
      className="inline-flex min-h-12 min-w-44 items-center justify-center gap-3 rounded-xl bg-zinc-950 px-4 py-2 text-left text-white shadow-sm ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="shrink-0">{icon}</span>
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
          icon={<AppleIcon className="size-6" />}
        />
      ) : null}
      {android ? (
        <StoreBadge
          href={android.url}
          eyebrow="Get it on"
          label="Google Play"
          icon={<GooglePlayIcon className="size-6" />}
        />
      ) : null}
    </div>
  );
}
