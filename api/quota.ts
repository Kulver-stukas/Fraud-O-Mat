import { getQuota } from "../server/quota.js";

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "GET") return Response.json({ error: "Method not allowed" }, { status: 405 });
    try {
      const quota = await getQuota();
      return Response.json(quota, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      console.error("Quota read failed:", error instanceof Error ? error.name : "unknown");
      return Response.json(
        { error: "QUOTA_UNAVAILABLE" },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }
  },
};
