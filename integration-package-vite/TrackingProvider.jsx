import { useEffect, useRef } from "react";
import { initTracking, trackPageView, setUser } from "./tracking";

/**
 * Auto page_view tracking for React SPA.
 *
 * Strategy:
 *  1. If React Router is present — listens to location changes via `useLocation()`.
 *  2. Otherwise — polls `window.location` on popstate + manual interval fallback.
 *
 * This component renders nothing. Zero DOM impact.
 */

// ── Route Tracker (no React Router dependency) ──

function RouteTracker() {
  const lastPathRef = useRef("");

  useEffect(() => {
    function checkAndTrack() {
      const current = window.location.pathname + window.location.search;
      if (current !== lastPathRef.current) {
        lastPathRef.current = current;
        trackPageView(current);
      }
    }

    // Track initial page
    checkAndTrack();

    // Listen to back/forward navigation
    window.addEventListener("popstate", checkAndTrack);

    // Patch pushState and replaceState to detect SPA navigations
    const originalPush = history.pushState;
    const originalReplace = history.replaceState;

    history.pushState = function (...args) {
      originalPush.apply(this, args);
      checkAndTrack();
    };

    history.replaceState = function (...args) {
      originalReplace.apply(this, args);
      checkAndTrack();
    };

    return () => {
      window.removeEventListener("popstate", checkAndTrack);
      history.pushState = originalPush;
      history.replaceState = originalReplace;
    };
  }, []);

  return null;
}

// ── Provider ──

export function TrackingProvider({ apiKey, endpoint, userIdentifier, debug, children }) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    initTracking({ apiKey, endpoint, userIdentifier, debug });
  }, [apiKey, endpoint, userIdentifier, debug]);

  useEffect(() => {
    if (userIdentifier) setUser(userIdentifier);
  }, [userIdentifier]);

  return (
    <>
      <RouteTracker />
      {children}
    </>
  );
}
