import { describe, it, expect } from "vitest";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

describe("Rate Limiter Unit Tests", () => {
  it("allows requests under the rate limit", () => {
    const key = `test-user-${Math.random()}`;
    const r1 = rateLimit(key, 3, 60000);
    expect(r1.success).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = rateLimit(key, 3, 60000);
    expect(r2.success).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = rateLimit(key, 3, 60000);
    expect(r3.success).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests exceeding the rate limit", () => {
    const key = `test-blocked-${Math.random()}`;
    rateLimit(key, 2, 60000);
    rateLimit(key, 2, 60000);

    const r3 = rateLimit(key, 2, 60000);
    expect(r3.success).toBe(false);
    expect(r3.remaining).toBe(0);
    expect(r3.reset).toBeGreaterThan(Date.now());
  });

  it("correctly parses client IP from X-Forwarded-For header", () => {
    const headers = new Headers();
    headers.set("x-forwarded-for", "203.0.113.195, 70.41.3.18");
    expect(getClientIp(headers)).toBe("203.0.113.195");
  });

  it("falls back to X-Real-IP or 127.0.0.1", () => {
    const headersReal = new Headers();
    headersReal.set("x-real-ip", "198.51.100.4");
    expect(getClientIp(headersReal)).toBe("198.51.100.4");

    const emptyHeaders = new Headers();
    expect(getClientIp(emptyHeaders)).toBe("127.0.0.1");
  });
});
