import { NextResponse } from "next/server";
import { hit } from "@/lib/rate-limit";

/**
 * Returns a 429 response if `key` is over budget, or null to proceed.
 *
 * Usage: `const limited = enforceRateLimit(...); if (limited) return limited;`
 */
export function enforceRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
  message = "Too many requests — give it a moment and try again."
): NextResponse | null {
  const result = hit(key, limit, windowSeconds);
  if (result.ok) return null;

  return NextResponse.json(
    { error: message, retryAfterSeconds: result.retryAfterSeconds },
    { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } }
  );
}
