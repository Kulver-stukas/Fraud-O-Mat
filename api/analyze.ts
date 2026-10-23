import { analyzeOffer } from "../server/analysis";
import { getQuota, reserveAnalysis } from "../server/quota";
import type { Locale, Tone } from "../shared/types";

const MAX_CHARS = 20000;
const sameOrigin = (request: Request): boolean => {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === new URL(request.url).host; }
  catch { return false; }
};

export default {
  async fetch(request: Request): Promise<Response> {
    const headers = { "Cache-Control": "no-store" };
    if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers });
    if (!sameOrigin(request)) return Response.json({ error: "FORBIDDEN" }, { status: 403, headers });
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return Response.json({ error: "INVALID_CONTENT_TYPE" }, { status: 415, headers });
    }
    if (Number(request.headers.get("content-length") || 0) > 100000) {
      return Response.json({ error: "INPUT_TOO_LONG" }, { status: 413, headers });
    }
    let body: Record<string, unknown>;
    try {
      const rawBody = await request.text();
      if (rawBody.length > 100000) throw new Error("body too large");
      body = JSON.parse(rawBody) as Record<string, unknown>;
      if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("not an object");
    } catch {
      return Response.json({ error: "INVALID_JSON" }, { status: 400, headers });
    }
    const offer = typeof body.offer === "string" ? body.offer.trim() : "";
    if (!offer || offer.length > MAX_CHARS) {
      return Response.json({ error: "INVALID_OFFER", maxChars: MAX_CHARS }, { status: 400, headers });
    }
    const locale: Locale = body.locale === "en" ? "en" : "ru";
    const tone: Tone = body.tone === "soft" || body.tone === "sharp" ? body.tone : "classic";

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "MODEL_NOT_CONFIGURED" }, { status: 503, headers });
    }
    let reserved;
    try { reserved = await reserveAnalysis(); }
    catch (error) {
      console.error("Quota reservation failed:", error instanceof Error ? error.name : "unknown");
      return Response.json({ error: "QUOTA_UNAVAILABLE" }, { status: 503, headers });
    }
    if (!reserved.allowed) {
      const error = reserved.quota.state === "unconfigured" ? "QUOTA_NOT_CONFIGURED" : "QUOTA_EXHAUSTED";
      return Response.json({ error, quota: reserved.quota }, { status: error === "QUOTA_EXHAUSTED" ? 429 : 503, headers });
    }
    try {
      const report = await analyzeOffer(offer, locale, tone);
      return Response.json({ ...report, quota: await getQuota().catch(() => reserved.quota) }, { headers });
    } catch (error) {
      // Never return raw API errors or user-entered content.
      const message = error instanceof Error ? error.message : "";
      console.error("Analysis failed:", error instanceof Error ? error.name : "unknown");
      const throttled = /429|RESOURCE_EXHAUSTED|quota|rate.?limit/i.test(message);
      return Response.json(
        { error: throttled ? "MODEL_RATE_LIMIT" : "ANALYSIS_FAILED", quota: reserved.quota },
        { status: throttled ? 429 : 502, headers }
      );
    }
  },
};
