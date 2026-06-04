import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Anti-abus du simulateur. Triple barrière :
 *   1. Cap par IP / 24h          → SIMULATOR_DAILY_IP_CAP   (default 3)
 *   2. Cap global / mois         → SIMULATOR_MONTHLY_CAP    (default 500)
 *
 * Backends :
 *   - Si UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN sont définis →
 *     compteurs persistants via @upstash/ratelimit (multi-instance safe).
 *   - Sinon → fallback compteurs en mémoire (single-instance, perdu au cold
 *     start serverless). Acceptable pour le dev local et la démo, PAS pour
 *     la prod sur Vercel multi-region.
 */

const DAILY_CAP = Number(process.env.SIMULATOR_DAILY_IP_CAP ?? 3);
const MONTHLY_CAP = Number(process.env.SIMULATOR_MONTHLY_CAP ?? 500);

const upstashConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL?.trim() &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

let ipLimiter: Ratelimit | null = null;
let monthlyLimiter: Ratelimit | null = null;

if (upstashConfigured) {
  const redis = Redis.fromEnv();
  ipLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(DAILY_CAP, "24 h"),
    prefix: "sim:ip",
    analytics: true,
  });
  monthlyLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(MONTHLY_CAP, "30 d"),
    prefix: "sim:global",
    analytics: true,
  });
}

// In-memory fallback. Same semantics, no persistence across instances.
type IpBucket = { count: number; resetAt: number };
const memoryIp = new Map<string, IpBucket>();
let memoryMonthlyCount = 0;
let memoryMonthlyResetAt = endOfMonth();

function endOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
}

export type LimitResult = { ok: boolean; remaining: number };

export async function checkIpLimit(ip: string): Promise<LimitResult> {
  if (ipLimiter) {
    const r = await ipLimiter.limit(ip);
    return { ok: r.success, remaining: r.remaining };
  }

  const now = Date.now();
  const bucket = memoryIp.get(ip);
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);

  if (!bucket || bucket.resetAt < now) {
    memoryIp.set(ip, { count: 1, resetAt: tomorrow.getTime() });
    return { ok: true, remaining: DAILY_CAP - 1 };
  }
  if (bucket.count >= DAILY_CAP) {
    return { ok: false, remaining: 0 };
  }
  bucket.count += 1;
  return { ok: true, remaining: DAILY_CAP - bucket.count };
}

export async function checkMonthlyLimit(): Promise<LimitResult> {
  if (monthlyLimiter) {
    const r = await monthlyLimiter.limit("global");
    return { ok: r.success, remaining: r.remaining };
  }

  const now = Date.now();
  if (memoryMonthlyResetAt < now) {
    memoryMonthlyCount = 0;
    memoryMonthlyResetAt = endOfMonth();
  }
  if (memoryMonthlyCount >= MONTHLY_CAP) {
    return { ok: false, remaining: 0 };
  }
  memoryMonthlyCount += 1;
  return { ok: true, remaining: MONTHLY_CAP - memoryMonthlyCount };
}

export function rateLimitBackend(): "upstash" | "memory" {
  return upstashConfigured ? "upstash" : "memory";
}
