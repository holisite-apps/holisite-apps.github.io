import { ShadcnSmokeTest } from "@/components/dev/shadcn-smoke-test";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          App SEO Landing Pages
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Next.js + shadcn/ui scaffold (Task 3)
        </p>
      </div>
      <ShadcnSmokeTest />
    </div>
  );
}
