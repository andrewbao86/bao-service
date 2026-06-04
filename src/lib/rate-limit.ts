type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 3;

function prune(key: string, now: number): Bucket {
  const existing = buckets.get(key);
  if (!existing || now >= existing.resetAt) {
    const fresh = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, fresh);
    return fresh;
  }
  return existing;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = prune(key, now);
  return bucket.count >= MAX_REQUESTS;
}

export function recordRateLimitHit(key: string): void {
  const now = Date.now();
  const bucket = prune(key, now);
  bucket.count += 1;
  buckets.set(key, bucket);
}
