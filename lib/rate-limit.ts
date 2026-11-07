type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      for (const [bucketKey, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(bucketKey);
      }
    }
    const fresh = { count: 1, resetAt: now + windowMs };
    buckets.set(key, fresh);
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  current.count += 1;
  const allowed = current.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - current.count),
    retryAfter: allowed ? 0 : Math.ceil((current.resetAt - now) / 1000),
  };
}

export function rateLimitResponse(retryAfter: number) {
  return new Response(JSON.stringify({ error: "Terlalu banyak request. Coba lagi nanti." }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfter),
    },
  });
}
