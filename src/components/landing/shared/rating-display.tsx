import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type RatingDisplayProps = {
  score?: number;
  count?: number;
  className?: string;
  compact?: boolean;
};

const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function RatingDisplay({
  score,
  count,
  className,
  compact = false,
}: RatingDisplayProps) {
  if (score == null) {
    return null;
  }

  const roundedScore = score.toFixed(1).replace(/\.0$/, "");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
      aria-label={
        count == null
          ? `Rated ${roundedScore} out of 5`
          : `Rated ${roundedScore} out of 5 from ${count} ratings`
      }
    >
      <span className="inline-flex items-center gap-1 text-amber-500">
        <StarIcon className="size-4 fill-current" aria-hidden="true" />
        <span className="font-semibold text-foreground">{roundedScore}</span>
      </span>
      {count != null && count > 0 ? (
        <span>{compact ? formatter.format(count) : `${formatter.format(count)} ratings`}</span>
      ) : null}
    </div>
  );
}
