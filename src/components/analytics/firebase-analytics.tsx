"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { logFirebaseEvent } from "@/lib/firebase/analytics";

export function FirebaseAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    void logFirebaseEvent("page_view", {
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
