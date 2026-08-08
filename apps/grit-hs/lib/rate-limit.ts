/**
 * In-memory sliding-window rate limiter.
 *
 * Scope caveat: state lives in one server instance's memory. On serverless
 * (Vercel), concurrent instances each keep their own window, so the effective
 * global limit is `limit x instance count`. That still stops the realistic
 * case — one account hammering an expensive endpoint — but it is not a
 * distributed guarantee. Swap `hit()` for a Redis INCR against a shared store
 * when traffic justifies it; call sites won't need to change.
 */

type Entry = { timestamps: number[] };

const buckets = new Map<string, Entry>();

// Bounds memory if a lot of distinct keys pass through before their windows lapse.
const MAX_TRACKED_KEYS = 10_000;

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function hit(key: string, limit: number, windowSeconds: number): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const cutoff = now - windowMs;

  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [k, v] of buckets) {
      if (v.timestamps.every((t) => t <= cutoff)) buckets.delete(k);
    }
  }

  const entry = buckets.get(key) ?? { timestamps: [] };
  const recent = entry.timestamps.filter((t) => t > cutoff);

  if (recent.length >= limit) {
    const oldest = Math.min(...recent);
    buckets.set(key, { timestamps: recent });
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  recent.push(now);
  buckets.set(key, { timestamps: recent });
  return { ok: true, remaining: limit - recent.length, retryAfterSeconds: 0 };
}

/** Falls back to a shared key when no IP header is present, so unknown callers still share one budget. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
