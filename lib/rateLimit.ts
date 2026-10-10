/**
 * In-memory sliding-window rate limiter
 * Note: In a serverless environment (Vercel), instances scale independently,
 * making this best-effort per instance. For distributed production, use Redis/Upstash.
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    ipStore.forEach((value, key) => {
      if (now > value.resetAt) {
        ipStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export function checkRateLimit(
  ip: string,
  limitPerMinute: number = 20
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 60 * 1000;

  const current = ipStore.get(ip);

  if (!current || now > current.resetAt) {
    ipStore.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: limitPerMinute - 1 };
  }

  if (current.count >= limitPerMinute) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  return { allowed: true, remaining: limitPerMinute - current.count };
}
