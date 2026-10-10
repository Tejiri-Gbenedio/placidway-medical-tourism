import { NextResponse } from "next/server";
import { HealthResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const useMock =
    process.env.USE_MOCK !== "false" || !process.env.N8N_CHAT_WEBHOOK_URL;

  const payload: HealthResponse = {
    status: "ok",
    mode: useMock ? "mock" : "live",
    upstream_configured: Boolean(process.env.N8N_CHAT_WEBHOOK_URL),
  };

  return NextResponse.json(payload, {
    headers: {
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
