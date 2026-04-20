/**
 * Simple in-memory rate limiter.
 * Limits requests per IP within a sliding window.
 * Resets on server restart (stateless).
 */

interface RateEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateEntry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute per IP

// Clean old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60_000);

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > MAX_REQUESTS;
}
