/**
 * In-memory sliding window rate limiter for Server Actions and API routes.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const store = new Map<string, RateLimitRecord>();

// Clean up stale records periodically every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStale(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of store.entries()) {
    const valid = record.timestamps.filter((ts) => now - ts < windowMs);
    if (valid.length === 0) {
      store.delete(key);
    } else {
      record.timestamps = valid;
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function rateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000
): RateLimitResult {
  cleanupStale(windowMs);

  const now = Date.now();
  const record = store.get(key) || { timestamps: [] };

  // Remove timestamps outside window
  const activeTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (activeTimestamps.length >= limit) {
    const oldest = activeTimestamps[0];
    const reset = oldest + windowMs;
    return {
      success: false,
      limit,
      remaining: 0,
      reset,
    };
  }

  activeTimestamps.push(now);
  store.set(key, { timestamps: activeTimestamps });

  return {
    success: true,
    limit,
    remaining: limit - activeTimestamps.length,
    reset: now + windowMs,
  };
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}
