import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type AppFooterProps = {
  brandName: string;
  developer?: string;
  privacyUrl?: string;
  termsUrl?: string;
  supportUrl?: string;
  websiteUrl?: string;
  className?: string;
};

const currentYear = new Date().getFullYear();

function FooterLink({ href, label }: { href?: string; label: string }) {
  if (!href) {
    return null;
  }

  return (
    <a
      className="transition hover:text-foreground"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}

export function AppFooter({
  brandName,
  developer,
  privacyUrl,
  termsUrl,
  supportUrl,
  websiteUrl,
  className,
}: AppFooterProps) {
  return (
    <footer className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8", className)}>
      <Separator className="mb-6" />
      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {currentYear} {brandName}
          {developer ? <span> · {developer}</span> : null}
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer">
          <FooterLink href={privacyUrl} label="Privacy" />
          <FooterLink href={termsUrl} label="Terms" />
          <FooterLink href={supportUrl} label="Support" />
          <FooterLink href={websiteUrl} label="Website" />
        </nav>
      </div>
    </footer>
  );
}
