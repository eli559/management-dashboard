/**
 * Analytics Tracking — Private Self-Hosted System
 * Zero dependencies. Non-blocking. Error-isolated.
 *
 * Capabilities:
 *  - Auto page_view on load
 *  - trackClick(elementId) — button/link clicks
 *  - trackFormSubmit(formId) — form submissions
 *  - trackEvent(name, metadata) — custom events
 *  - setUser(id) — identify user after login
 *  - resetTracking() — clear session on logout
 *
 * PRODUCTION: Change CONFIG values below.
 */

// ══════════════════════════════════════════════════
//  CONFIG
// ══════════════════════════════════════════════════

const TRACKING_API_KEY = "pk_REPLACE_WITH_YOUR_API_KEY";
const TRACKING_ENDPOINT = "http://localhost:8090/api/events/ingest";
const DEBUG = false;

// ══════════════════════════════════════════════════
//  Internal
// ══════════════════════════════════════════════════

let _userIdentifier = null;
let _sessionId = null;

const SENSITIVE_PARAMS = new Set([
  "token", "access_token", "refresh_token", "id_token", "auth", "auth_token",
  "apikey", "api_key", "key", "secret", "password", "pwd", "session_token",
  "code", "reset", "reset_token", "invite", "invite_token", "credit_card", "cc",
]);

function sanitizePage(raw) {
  try {
    const q = raw.indexOf("?");
    if (q === -1) return raw;
    const path = raw.substring(0, q);
    const params = new URLSearchParams(raw.substring(q + 1));
    let changed = false;
    const keys = Array.from(params.keys());
    for (let i = 0; i < keys.length; i++) {
      if (SENSITIVE_PARAMS.has(keys[i].toLowerCase())) {
        params.set(keys[i], "[REDACTED]");
        changed = true;
      }
    }
    if (!changed) return raw;
    const s = params.toString();
    return s ? `${path}?${s}` : path;
  } catch {
    const q = raw.indexOf("?");
    return q === -1 ? raw : raw.substring(0, q);
  }
}

function noop() {}

function getSessionId() {
  if (_sessionId) return _sessionId;
  try {
    const existing = sessionStorage.getItem("_t_sid");
    if (existing) { _sessionId = existing; return existing; }
  } catch {}

  let id;
  try { id = "sess_" + crypto.randomUUID(); }
  catch {
    id = "sess_" + "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  _sessionId = id;
  try { sessionStorage.setItem("_t_sid", id); } catch {}
  return id;
}

function getCurrentPage() {
  return sanitizePage(window.location.pathname + window.location.search);
}

async function send(eventName, options) {
  try {
    const page = options?.page ? sanitizePage(options.page) : getCurrentPage();
    const payload = {
      apiKey: TRACKING_API_KEY,
      eventName,
      sessionId: getSessionId(),
      userIdentifier: _userIdentifier,
      page,
      value: options?.value ?? null,
      metadata: options?.metadata ?? {},
    };

    await fetch(TRACKING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    if (DEBUG) console.log(`[tracking] ✓ ${eventName}`, payload);
  } catch (err) {
    if (DEBUG) console.error(`[tracking] ✗ ${eventName}`, err);
  }
}

// ══════════════════════════════════════════════════
//  Public API
// ══════════════════════════════════════════════════

/** Track a custom event */
export function trackEvent(name, metadata) {
  void send(name, { metadata }).catch(noop);
}

/** Track a button/element click */
export function trackClick(elementId, metadata) {
  void send("button_click", { metadata: { element_id: elementId, ...metadata } }).catch(noop);
}

/** Track a form submission (do NOT send field values) */
export function trackFormSubmit(formId, metadata) {
  void send("form_submit", { metadata: { form_id: formId, ...metadata } }).catch(noop);
}

/** Track a page view */
export function trackPageView(page) {
  void send("page_view", { page: page ?? getCurrentPage() }).catch(noop);
}

/** Identify user after login */
export function setUser(userId) {
  _userIdentifier = userId;
}

/** Clear session + user on logout */
export function resetTracking() {
  _sessionId = null;
  _userIdentifier = null;
  try { sessionStorage.removeItem("_t_sid"); } catch {}
}

// ══════════════════════════════════════════════════
//  Auto page_view on load
// ══════════════════════════════════════════════════

try {
  if (DEBUG) console.log("[tracking] Initialized", { endpoint: TRACKING_ENDPOINT, sessionId: getSessionId() });
  trackPageView();
} catch {}
