# TASK: Integrate Event Tracking into This Project

You are integrating a tracking system into this project. Follow these steps exactly. Do not skip steps. Do not improvise. Execute each step in order.

---

## CRITICAL RULES — NON-INVASIVE INTEGRATION

These rules are absolute. Violating any of them is a failure.

1. **DO NOT modify any existing business logic, components, hooks, or utilities.**
2. **DO NOT rewrite, refactor, or "improve" any existing code.** You are only ADDING new files and minimal imports.
3. **DO NOT change any UI** — no new visual elements, no layout changes, no style modifications.
4. **DO NOT change any user flow** — no redirects, no conditional rendering, no behavior changes.
5. **DO NOT install any npm packages.** The tracking client has zero dependencies.
6. **DO NOT read, capture, or send** any form field values, input contents, passwords, tokens, cookies, localStorage keys, or any user-entered data. The tracking system only sends: event names, page paths, element IDs, and explicitly provided metadata.
7. **DO NOT wrap existing components in new components.** The only wrapping is `{children}` in the root layout with `TrackingProvider`.
8. **If anything is unclear, STOP and ask.** Do not guess.

Your total footprint in the target project should be:
- **4 new files** in `src/lib/tracking/`
- **2 lines changed** in the root layout (1 import + 1 wrapper)
- **0 lines changed** in any other existing file

---

## CONFIGURATION — REPLACE THESE TWO VALUES

```
API_KEY  = "pk_REPLACE_WITH_YOUR_API_KEY"
ENDPOINT = "https://YOUR_DOMAIN/api/events/ingest"
```

The user will provide the real values. If they haven't, ask before proceeding.

---

## STEP 1 — Create `src/lib/tracking/tracking.ts`

Create the file `src/lib/tracking/tracking.ts` with this exact content:

```ts
/**
 * Standalone Tracking Client — Hardened Edition
 * Zero dependencies. SSR-safe. Non-blocking. Error-isolated.
 * Sends events to a remote analytics API via fetch.
 */

// ── Types ──────────────────────────────────────────────

export interface TrackingConfig {
  /** API key for the project (starts with pk_) */
  apiKey: string;
  /** Full URL of the ingestion endpoint */
  endpoint: string;
  /** Optional: identify the current user */
  userIdentifier?: string;
  /** Log events to console for development */
  debug?: boolean;
}

interface SendOptions {
  value?: number;
  page?: string;
  metadata?: Record<string, unknown>;
}

// ── Private State ──────────────────────────────────────

let _config: TrackingConfig | null = null;
let _sessionId: string | null = null;
let _queue: Array<{ eventName: string; options?: SendOptions }> = [];

const MAX_QUEUE = 100;

// ── Page-View Deduplication ────────────────────────────

let _lastPagePath: string | null = null;
let _lastPageTime = 0;
const DEDUP_MS = 500;

function isDuplicatePageView(page: string): boolean {
  const now = Date.now();
  if (_lastPagePath === page && now - _lastPageTime < DEDUP_MS) {
    return true;
  }
  _lastPagePath = page;
  _lastPageTime = now;
  return false;
}

// ── Sensitive URL Param Stripping ──────────────────────

const SENSITIVE_PARAMS = new Set([
  "token",
  "access_token",
  "refresh_token",
  "id_token",
  "auth",
  "auth_token",
  "apikey",
  "api_key",
  "key",
  "secret",
  "password",
  "pwd",
  "session_token",
  "code",
  "reset",
  "reset_token",
  "invite",
  "invite_token",
  "credit_card",
  "cc",
]);

function sanitizePage(raw: string): string {
  try {
    const qIndex = raw.indexOf("?");
    if (qIndex === -1) return raw;

    const path = raw.substring(0, qIndex);
    const search = raw.substring(qIndex + 1);
    const params = new URLSearchParams(search);
    let redacted = false;

    const keys = Array.from(params.keys());
    for (let i = 0; i < keys.length; i++) {
      if (SENSITIVE_PARAMS.has(keys[i].toLowerCase())) {
        params.set(keys[i], "[REDACTED]");
        redacted = true;
      }
    }

    if (!redacted) return raw;
    const cleaned = params.toString();
    return cleaned ? `${path}?${cleaned}` : path;
  } catch {
    const qIndex = raw.indexOf("?");
    return qIndex === -1 ? raw : raw.substring(0, qIndex);
  }
}

// ── Internals ──────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function noop() {}

function generateId(): string {
  try {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
  } catch {
    // crypto.randomUUID not available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getSessionId(): string {
  if (_sessionId) return _sessionId;

  if (isBrowser()) {
    try {
      const stored = sessionStorage.getItem("_t_sid");
      if (stored) {
        _sessionId = stored;
        return stored;
      }
    } catch {
      // sessionStorage blocked (incognito / iframe)
    }
  }

  const id = `sess_${generateId()}`;
  _sessionId = id;

  if (isBrowser()) {
    try {
      sessionStorage.setItem("_t_sid", id);
    } catch {
      // sessionStorage blocked
    }
  }

  return id;
}

function getCurrentPage(): string | null {
  if (!isBrowser()) return null;
  return sanitizePage(window.location.pathname + window.location.search);
}

async function send(eventName: string, options?: SendOptions): Promise<void> {
  if (!isBrowser()) return;

  try {
    if (!_config) {
      if (_queue.length < MAX_QUEUE) {
        _queue.push({ eventName, options });
      }
      return;
    }

    const page = options?.page
      ? sanitizePage(options.page)
      : getCurrentPage();

    const payload = {
      apiKey: _config.apiKey,
      eventName,
      sessionId: getSessionId(),
      userIdentifier: _config.userIdentifier ?? null,
      page,
      value: options?.value ?? null,
      metadata: options?.metadata ?? {},
    };

    await fetch(_config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    if (_config.debug) {
      console.log(`[tracking] ✓ ${eventName}`, payload);
    }
  } catch (err) {
    if (_config?.debug) {
      console.error(`[tracking] ✗ ${eventName}`, err);
    }
  }
}

function flushQueue(): void {
  const pending = [..._queue];
  _queue = [];
  for (const item of pending) {
    void send(item.eventName, item.options).catch(noop);
  }
}

// ── Public API ─────────────────────────────────────────

export function initTracking(config: TrackingConfig): void {
  try {
    _config = { ...config };
    _sessionId = getSessionId();

    if (_config.debug) {
      console.log("[tracking] Initialized", {
        endpoint: _config.endpoint,
        sessionId: _sessionId,
      });
    }

    flushQueue();
  } catch {
    // Never throw from init
  }
}

export function trackPageView(page?: string): void {
  const resolved = page ?? getCurrentPage() ?? "";
  if (isDuplicatePageView(resolved)) return;
  void send("page_view", { page: resolved }).catch(noop);
}

export function trackEvent(
  name: string,
  metadata?: Record<string, unknown>
): void {
  void send(name, { metadata }).catch(noop);
}

export function trackClick(
  elementId: string,
  metadata?: Record<string, unknown>
): void {
  void send("button_click", { metadata: { elementId, ...metadata } }).catch(
    noop
  );
}

export function trackFormSubmit(
  formId: string,
  metadata?: Record<string, unknown>
): void {
  void send("form_submit", { metadata: { formId, ...metadata } }).catch(noop);
}

export function setUser(userIdentifier: string): void {
  if (_config) {
    _config.userIdentifier = userIdentifier;
  }
}

export function resetTracking(): void {
  _sessionId = null;
  _lastPagePath = null;
  _lastPageTime = 0;
  if (_config) {
    _config.userIdentifier = undefined;
  }
  if (isBrowser()) {
    try {
      sessionStorage.removeItem("_t_sid");
    } catch {
      // ignore
    }
  }
}
```

---

## STEP 2 — Create `src/lib/tracking/TrackingProvider.tsx`

Create the file `src/lib/tracking/TrackingProvider.tsx` with this exact content:

```tsx
"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  initTracking,
  trackPageView,
  setUser,
  type TrackingConfig,
} from "./tracking";

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedRef = useRef<string>("");

  useEffect(() => {
    const search = searchParams?.toString();
    const fullPath = search ? `${pathname}?${search}` : pathname;

    if (fullPath === lastTrackedRef.current) return;
    lastTrackedRef.current = fullPath;

    trackPageView(fullPath);
  }, [pathname, searchParams]);

  return null;
}

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
```

---

## STEP 3 — Create `src/lib/tracking/useTracking.ts`

Create the file `src/lib/tracking/useTracking.ts` with this exact content:

```ts
"use client";

import { useCallback } from "react";
import { trackEvent, trackClick, trackFormSubmit } from "./tracking";

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
```

---

## STEP 4 — Create `src/lib/tracking/index.ts`

Create a barrel export file `src/lib/tracking/index.ts`:

```ts
export {
  initTracking,
  trackPageView,
  trackEvent,
  trackClick,
  trackFormSubmit,
  setUser,
  resetTracking,
  type TrackingConfig,
} from "./tracking";
export { TrackingProvider } from "./TrackingProvider";
export { useTracking } from "./useTracking";
```

---

## STEP 5 — Add TrackingProvider to the Root Layout

Find the project's root layout file. It is typically at one of these paths:
- `src/app/layout.tsx`
- `app/layout.tsx`

Modify it as follows:

### 5a. Add the import at the top of the file:

```tsx
import { TrackingProvider } from "@/lib/tracking";
```

### 5b. Wrap ONLY the `{children}` inside `<body>` with TrackingProvider:

BEFORE:
```tsx
<body ...>
  {children}
</body>
```

AFTER:
```tsx
<body ...>
  <TrackingProvider
    apiKey="pk_REPLACE_WITH_YOUR_API_KEY"
    endpoint="https://YOUR_DOMAIN/api/events/ingest"
    debug={process.env.NODE_ENV === "development"}
  >
    {children}
  </TrackingProvider>
</body>
```

### IMPORTANT CONSTRAINTS FOR THIS STEP:

- **Preserve ALL existing attributes** on the `<body>` tag — className, suppressHydrationWarning, etc.
- **Preserve ALL existing providers** that wrap children (ThemeProvider, AuthProvider, etc.). Place TrackingProvider as the OUTERMOST wrapper around `{children}`, wrapping the existing providers.
- **Do NOT move, rename, or restructure** any existing imports or components.
- The ONLY change is: 1 new import line + wrapping `{children}` with `<TrackingProvider>`.
- If the body has other direct children besides `{children}` (like a Toaster, Script tag, etc.), only wrap `{children}`, not the other elements.

### 5c. Replace the apiKey and endpoint with the real values provided by the user.

---

## STEP 6 — Verify

Run `npm run build` (or the project's build command). The build MUST pass. If it fails, the error is in your integration — fix it without touching existing project files.

---

## STEP 7 — Done

Integration is complete. Every page navigation now automatically sends a `page_view` event. No further changes are needed for basic tracking.

---

## USAGE EXAMPLES — Only Apply If the User Asks

Do NOT proactively add tracking calls to existing components. Only show these examples if the user explicitly asks to track specific interactions.

### Track a button click

In any Client Component (`"use client"`):

```tsx
import { useTracking } from "@/lib/tracking";

export function SomeComponent() {
  const { click } = useTracking();

  return (
    <button onClick={() => click("cta-signup", { location: "hero" })}>
      Sign Up
    </button>
  );
}
```

### Track a form submission

```tsx
import { useTracking } from "@/lib/tracking";

export function SomeForm() {
  const { formSubmit } = useTracking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formSubmit("contact-form", { source: "footer" });
    // ... existing form logic unchanged ...
  };

  return <form onSubmit={handleSubmit}>{/* existing fields — do not modify */}</form>;
}
```

IMPORTANT: When adding tracking to a form, add ONLY the `formSubmit()` call. Do NOT read or send any field values (email, name, password, etc.). Only send the form ID and non-sensitive metadata.

### Track a custom event

```tsx
import { trackEvent } from "@/lib/tracking";

// Fire-and-forget, non-blocking:
trackEvent("pricing_view", { plan: "pro" });
```

### Identify user after login

```tsx
import { setUser } from "@/lib/tracking";

// After successful auth:
setUser("user_12345");
```

### Reset on logout

```tsx
import { resetTracking } from "@/lib/tracking";

// On logout:
resetTracking();
```

---

## PRIVACY & DATA RULES

1. **URLs are auto-sanitized.** Query params like `token`, `access_token`, `password`, `code`, `secret`, `api_key`, and 15+ other sensitive param names are automatically replaced with `[REDACTED]` before sending.
2. **NEVER pass user-entered text** (form inputs, search queries, free-text fields) as metadata values.
3. **NEVER pass PII** (name, email, phone, address, credit card, SSN) as metadata values.
4. **Allowed metadata values:** element IDs, page names, plan names, button labels, feature flags, A/B test variants, non-sensitive enums, counts.
5. **The tracking client stores exactly one item** in `sessionStorage`: a session ID (`_t_sid`). It does not read any other storage.

---

## API REFERENCE

```
POST {endpoint}
Content-Type: application/json

{
  "apiKey":          string  (required — project API key),
  "eventName":       string  (required — e.g. "page_view"),
  "sessionId":       string  (auto-generated per browser tab),
  "userIdentifier":  string | null (set via setUser()),
  "page":            string | null (auto-captured, sanitized),
  "value":           number | null,
  "metadata":        object  (custom key-value pairs)
}

201: { "success": true, "eventId": string }
400: { "error": string, "details": object }
401: { "error": "Invalid API key" }
```

---

## SAFETY PROPERTIES OF THIS INTEGRATION

- **Non-blocking:** All sends are fire-and-forget. No `await` in UI code. Uses `keepalive: true` for page transitions.
- **Error-isolated:** Every function is wrapped in try-catch. Tracking failures never propagate to the host application.
- **SSR-safe:** All browser APIs are guarded with `typeof window !== "undefined"`. Safe to import in Server Components (functions no-op in SSR).
- **Deduplication:** `page_view` events are deduplicated within 500ms. React StrictMode double-fire is handled with refs.
- **Queue with cap:** Events sent before `initTracking()` are queued (max 100). Overflow is silently dropped.
- **Zero DOM impact:** `TrackingProvider` renders as a React Fragment — no wrapper elements, no layout changes.
- **Zero dependency:** Only uses `fetch`, `sessionStorage`, `crypto.randomUUID` — all native browser APIs.

---

## VERIFICATION CHECKLIST

After integration, confirm:

- [ ] `src/lib/tracking/tracking.ts` exists
- [ ] `src/lib/tracking/TrackingProvider.tsx` exists
- [ ] `src/lib/tracking/useTracking.ts` exists
- [ ] `src/lib/tracking/index.ts` exists
- [ ] Root layout has `<TrackingProvider>` wrapping `{children}`
- [ ] apiKey and endpoint are set to real values (not placeholders)
- [ ] `npm run build` passes with zero errors
- [ ] No existing files were modified (except root layout: 1 import + 1 wrapper)
- [ ] No existing tests were broken
