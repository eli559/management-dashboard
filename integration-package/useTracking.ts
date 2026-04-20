"use client";

import { useCallback } from "react";
import { trackEvent, trackClick, trackFormSubmit } from "./tracking";

/**
 * Hook for convenient tracking inside components.
 *
 * Usage:
 *   const { track, click, formSubmit } = useTracking();
 *   <button onClick={() => click("cta-hero")}>Sign Up</button>
 */
export function useTracking() {
  const track = useCallback(
    (name: string, metadata?: Record<string, unknown>) => {
      trackEvent(name, metadata);
    },
    []
  );

  const click = useCallback(
    (elementId: string, metadata?: Record<string, unknown>) => {
      trackClick(elementId, metadata);
    },
    []
  );

  const formSubmit = useCallback(
    (formId: string, metadata?: Record<string, unknown>) => {
      trackFormSubmit(formId, metadata);
    },
    []
  );

  return { track, click, formSubmit };
}
