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
    // If URL parsing fails, return path only (strip all query params)
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
  // ── Guard: only send from browser ──
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
    // All errors are silenced — tracking must never break the host app
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
// Every public function is:
//   1. void return (non-blocking)
//   2. wrapped with .catch(noop) (no unhandled rejections)
//   3. safe to call from SSR (silently no-ops)

/**
 * Initialize tracking. Must be called once.
 * Events sent before init are queued (max 100) and flushed automatically.
 */
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

/**
 * Send a page_view event.
 * Includes built-in deduplication — safe to call multiple times on the same page.
 * Automatically strips sensitive query params from URLs.
 */
export function trackPageView(page?: string): void {
  const resolved = page ?? getCurrentPage() ?? "";
  if (isDuplicatePageView(resolved)) return;
  void send("page_view", { page: resolved }).catch(noop);
}

/** Send a custom named event with optional metadata. */
export function trackEvent(
  name: string,
  metadata?: Record<string, unknown>
): void {
  void send(name, { metadata }).catch(noop);
}

/** Send a button_click event. Pass the element ID or name for identification. */
export function trackClick(
  elementId: string,
  metadata?: Record<string, unknown>
): void {
  void send("button_click", { metadata: { elementId, ...metadata } }).catch(
    noop
  );
}

/** Send a form_submit event. Pass the form ID or name for identification. */
export function trackFormSubmit(
  formId: string,
  metadata?: Record<string, unknown>
): void {
  void send("form_submit", { metadata: { formId, ...metadata } }).catch(noop);
}

/** Update the user identifier after login or identification. */
export function setUser(userIdentifier: string): void {
  if (_config) {
    _config.userIdentifier = userIdentifier;
  }
}

/** Clear session and user data (e.g., on logout). */
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
