/**
 * Analytics Tracking — Private Self-Hosted System
 * Zero dependencies. Non-blocking. Error-isolated.
 * Auto-sends a single page_view on load.
 *
 * SETUP: Change the two values below, then import this file in main.jsx.
 * PRODUCTION: Replace endpoint with your production analytics URL.
 */

// ══════════════════════════════════════════════════
//  CONFIG — Change these values
// ══════════════════════════════════════════════════

const TRACKING_API_KEY = "pk_bc74353dad5fde01bf0bf07f41fd4d6f8f3b35ae89c9ea9b";
const TRACKING_ENDPOINT = "http://localhost:3001/api/events/ingest";
const DEBUG = true; // set to false in production

// ══════════════════════════════════════════════════
//  Internal — do not modify below this line
// ══════════════════════════════════════════════════

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

function getSessionId() {
  try {
    const existing = sessionStorage.getItem("_t_sid");
    if (existing) return existing;
  } catch {}

  let id;
  try {
    id = "sess_" + crypto.randomUUID();
  } catch {
    id = "sess_" + "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  try { sessionStorage.setItem("_t_sid", id); } catch {}
  return id;
}

async function sendEvent(eventName, page) {
  try {
    const payload = {
      apiKey: TRACKING_API_KEY,
      eventName,
      sessionId: getSessionId(),
      userIdentifier: null,
      page,
      value: null,
      metadata: {},
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
//  Auto page_view — runs once on import
// ══════════════════════════════════════════════════

try {
  const page = sanitizePage(window.location.pathname + window.location.search);
  if (DEBUG) console.log("[tracking] Initialized", { endpoint: TRACKING_ENDPOINT, sessionId: getSessionId() });
  void sendEvent("page_view", page);
} catch {
  // Tracking must never break the host app
}
