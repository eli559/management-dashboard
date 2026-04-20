"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  initTracking,
  trackPageView,
  setUser,
  type TrackingConfig,
} from "./tracking";

// ── Internal: tracks route changes with deduplication ──

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedRef = useRef<string>("");

  useEffect(() => {
    const search = searchParams?.toString();
    const fullPath = search ? `${pathname}?${search}` : pathname;

    // Deduplicate: skip if same path (handles React StrictMode double-fire)
    if (fullPath === lastTrackedRef.current) return;
    lastTrackedRef.current = fullPath;

    trackPageView(fullPath);
  }, [pathname, searchParams]);

  return null;
}

// ── Public: wrap your app with this ──
// Renders as Fragment — zero DOM impact, no layout changes.

interface TrackingProviderProps extends TrackingConfig {
  children: React.ReactNode;
}

export function TrackingProvider({
  apiKey,
  endpoint,
  userIdentifier,
  debug,
  children,
}: TrackingProviderProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double-init from StrictMode
    if (initializedRef.current) return;
    initializedRef.current = true;
    initTracking({ apiKey, endpoint, userIdentifier, debug });
  }, [apiKey, endpoint, userIdentifier, debug]);

  useEffect(() => {
    if (userIdentifier) {
      setUser(userIdentifier);
    }
  }, [userIdentifier]);

  return (
    <>
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
      {children}
    </>
  );
}
