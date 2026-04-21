"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Auto-refreshes the page data using Next.js router.refresh().
 * Only runs when the tab is visible and not during user interaction.
 */
export function LiveRefresh({ interval = 30 }: { interval?: number }) {
  const router = useRouter();
  const lastRefresh = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Only refresh if tab is visible and enough time passed
      if (document.visibilityState === "visible") {
        const now = Date.now();
        if (now - lastRefresh.current > interval * 1000 * 0.8) {
          lastRefresh.current = now;
          router.refresh();
        }
      }
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [router, interval]);

  return null;
}
