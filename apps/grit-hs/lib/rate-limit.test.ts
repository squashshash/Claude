import { describe, it, expect } from "vitest";
import { hit, clientIp } from "./rate-limit";

describe("hit", () => {
  it("allows requests up to the limit, then blocks", () => {
    const key = `test-basic-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(hit(key, 3, 60).ok).toBe(true);
    }
    expect(hit(key, 3, 60).ok).toBe(false);
  });

  it("reports remaining budget as it is consumed", () => {
    const key = `test-remaining-${Math.random()}`;
    expect(hit(key, 3, 60).remaining).toBe(2);
    expect(hit(key, 3, 60).remaining).toBe(1);
    expect(hit(key, 3, 60).remaining).toBe(0);
  });

  it("gives a positive retry hint once blocked", () => {
    const key = `test-retry-${Math.random()}`;
    hit(key, 1, 60);
    const blocked = hit(key, 1, 60);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it("keeps separate budgets per key", () => {
    const a = `test-iso-a-${Math.random()}`;
    const b = `test-iso-b-${Math.random()}`;
    hit(a, 1, 60);
    expect(hit(a, 1, 60).ok).toBe(false);
    expect(hit(b, 1, 60).ok).toBe(true);
  });

  it("lets requests through again once the window lapses", async () => {
    const key = `test-window-${Math.random()}`;
    expect(hit(key, 1, 1).ok).toBe(true);
    expect(hit(key, 1, 1).ok).toBe(false);
    await new Promise((r) => setTimeout(r, 1100));
    expect(hit(key, 1, 1).ok).toBe(true);
  });
});

describe("clientIp", () => {
  it("takes the first address from x-forwarded-for", () => {
    const req = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.5, 70.41.3.18" },
    });
    expect(clientIp(req)).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip", () => {
    const req = new Request("https://example.com", {
      headers: { "x-real-ip": "203.0.113.9" },
    });
    expect(clientIp(req)).toBe("203.0.113.9");
  });

  it("returns a shared bucket when no IP header is present", () => {
    expect(clientIp(new Request("https://example.com"))).toBe("unknown");
  });
});
