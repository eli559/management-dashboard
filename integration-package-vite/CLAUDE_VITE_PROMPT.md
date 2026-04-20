# TASK: Add page_view tracking to this React + Vite project

You are adding a single analytics tracking file. It sends one `page_view` event when the app loads. The tracking connects to the user's own private analytics dashboard — not an external service.

---

## RULES

1. **Create 1 new file.** That's it.
2. **Add 1 import line** to the existing entry file (`main.jsx` or `main.js`).
3. **DO NOT modify any existing logic, UI, components, styles, or user flows.**
4. **DO NOT install any npm packages.**
5. **DO NOT send any form data, user input, passwords, tokens, or PII.**

Total footprint: **1 new file + 1 new import line.**

---

## STEP 1 — Create `src/lib/tracking.js`

Create the file `src/lib/tracking.js` with this exact content:

```js
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
```

---

## STEP 2 — Add one import to the entry file

Find the app's entry file. In Vite + React projects this is usually `src/main.jsx` or `src/main.js`.

Add this single line at the top of the file, after the existing imports:

```js
import "./lib/tracking";
```

That's it. Do NOT add anything else. Do NOT wrap components. Do NOT modify any existing code in this file.

Example — if the file currently looks like this:

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

It should become:

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/tracking";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## STEP 3 — Done

The file auto-executes on import and sends exactly one `page_view` event. Nothing else to do.

If `DEBUG` is `true`, the browser console will show:
```
[tracking] Initialized { endpoint: "http://localhost:3001/api/events/ingest", sessionId: "sess_..." }
[tracking] ✓ page_view { apiKey: "pk_...", eventName: "page_view", page: "/current-page", ... }
```

---

## WHAT THIS DOES

- Sends **one** `page_view` event when the app loads
- Includes: current page path, a random session ID, and the API key
- **Does NOT send:** form data, user input, passwords, tokens, PII, cookies, or localStorage
- **Does NOT modify:** any DOM, UI, component, style, or behavior
- **Does NOT install:** any package
- Sensitive URL params (token, password, code, etc.) are auto-redacted before sending
- All errors are silently caught — tracking can never break the host app
- Stores one item in `sessionStorage`: a random session ID (`_t_sid`)

---

## FOR PRODUCTION LATER

When moving to production, change these 3 values at the top of `src/lib/tracking.js`:

```js
const TRACKING_API_KEY = "pk_YOUR_PRODUCTION_KEY";
const TRACKING_ENDPOINT = "https://your-analytics-domain.com/api/events/ingest";
const DEBUG = false;
```
