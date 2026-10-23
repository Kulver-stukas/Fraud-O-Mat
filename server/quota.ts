import { Redis } from "@upstash/redis";
import type { QuotaStatus } from "../shared/types";

const REQUESTS_PER_ANALYSIS = 2;
const configuredDailyLimit = Number(process.env.GEMINI_RPD_LIMIT || "20");
const DAILY_LIMIT = Number.isFinite(configuredDailyLimit)
  ? Math.max(2, Math.min(1000, Math.floor(configuredDailyLimit)))
  : 20;
const pacific = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function pacificDay(timestamp: number): string {
  const date = pacific.formatToParts(new Date(timestamp));
  const get = (type: string) => date.find((part) => part.type === type)?.value || "";
  return get("year") + "-" + get("month") + "-" + get("day");
}

export function quotaPeriod(now = Date.now()) {
  const day = pacificDay(now);
  let lower = now;
  let upper = now + 27 * 60 * 60 * 1000; // covers PST/PDT transition
  while (upper - lower > 1000) {
    const midpoint = Math.floor((upper + lower) / 2);
    if (pacificDay(midpoint) === day) lower = midpoint;
    else upper = midpoint;
  }
  const reset = new Date(upper);
  return {
    key: "fraud-o-mat:v34:gemini:" + day,
    resetAt: reset.toISOString(),
    ttlSeconds: Math.ceil((upper - now) / 1000) + 120,
  };
}

const isConfigured = () =>
  Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

function store(): Redis {
  return Redis.fromEnv();
}

function status(usedRequests: number | null, resetAt: string, state: QuotaStatus["state"]): QuotaStatus {
  return {
    state,
    dailyRequests: DAILY_LIMIT,
    requestsPerAnalysis: REQUESTS_PER_ANALYSIS,
    usedRequests,
    remainingAnalyses: usedRequests === null
      ? null
      : Math.max(0, Math.floor((DAILY_LIMIT - usedRequests) / REQUESTS_PER_ANALYSIS)),
    resetAt,
  };
}

export async function getQuota(): Promise<QuotaStatus> {
  const { key, resetAt } = quotaPeriod();
  if (!isConfigured()) return status(null, resetAt, "unconfigured");
  const used = Number((await store().get<number>(key)) ?? 0);
  if (!Number.isFinite(used) || used < 0) throw new Error("Invalid counter state");
  return status(used, resetAt, "ready");
}

const RESERVE = `
  local current = tonumber(redis.call("GET", KEYS[1]) or "0")
  local amount = tonumber(ARGV[1])
  local limit = tonumber(ARGV[2])
  if current + amount > limit then return {0, current} end
  local next = redis.call("INCRBY", KEYS[1], amount)
  if current == 0 then redis.call("EXPIRE", KEYS[1], tonumber(ARGV[3])) end
  return {1, next}
`;

export async function reserveAnalysis(): Promise<{ allowed: boolean; quota: QuotaStatus }> {
  const { key, resetAt, ttlSeconds } = quotaPeriod();
  if (!isConfigured()) return { allowed: false, quota: status(null, resetAt, "unconfigured") };
  const result = await store().eval(RESERVE, [key], [
    String(REQUESTS_PER_ANALYSIS),
    String(DAILY_LIMIT),
    String(ttlSeconds),
  ]) as [number, number];
  if (!Array.isArray(result) || result.length !== 2) throw new Error("Invalid quota reservation");
  const allowed = Number(result[0]) === 1;
  const used = Number(result[1]);
  return { allowed, quota: status(used, resetAt, "ready") };
}
