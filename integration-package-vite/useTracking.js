import { useCallback } from "react";
import { trackEvent, trackClick, trackFormSubmit } from "./tracking";

export function useTracking() {
  const track = useCallback((name, metadata) => {
    trackEvent(name, metadata);
  }, []);

  const click = useCallback((elementId, metadata) => {
    trackClick(elementId, metadata);
  }, []);

  const formSubmit = useCallback((formId, metadata) => {
    trackFormSubmit(formId, metadata);
  }, []);

  return { track, click, formSubmit };
}
