"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Auto-refreshes the page data every N seconds using Next.js router.refresh().
 * This re-runs Server Components without a full page reload,
 * so numbers update smoothly in-place.
 */
export function LiveRefresh({ interval = 15 }: { interval?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      router.refresh();
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [router, interval]);

  return null;
}
