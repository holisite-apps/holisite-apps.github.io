import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type AppHeaderProps = {
  name: string;
  icon?: string;
  templateLabel?: string;
  privacyUrl?: string;
  className?: string;
};

export function AppHeader({
  name,
  icon,
  templateLabel,
  privacyUrl,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8",
        className,
      )}
    >
      <Link className="flex min-w-0 items-center gap-3" href="/">
        {icon ? (
          <Image
            className="size-10 rounded-xl object-cover shadow-sm ring-1 ring-foreground/10"
            src={icon}
            alt={`${name} icon`}
            width={40}
            height={40}
            priority
          />
        ) : (
          <span
            className="grid size-10 place-items-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {name.slice(0, 1)}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{name}</span>
          {templateLabel ? (
            <Badge className="mt-1" variant="secondary">
              {templateLabel}
            </Badge>
          ) : null}
        </span>
      </Link>

      {privacyUrl ? (
        <a
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          href={privacyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy
        </a>
      ) : null}
    </header>
  );
}
