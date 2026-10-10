import { NextResponse } from "next/server";
import { KNOWLEDGE_SOURCES } from "@/config/sources";
import { SourcesResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const sourcesPayload: SourcesResponse = {
    last_refreshed: "2026-10-07",
    sources: KNOWLEDGE_SOURCES.map((s) => ({
      title: s.title,
      url: s.url,
      page_type: s.page_type,
      last_refreshed: s.last_refreshed,
    })),
  };

  return NextResponse.json(sourcesPayload, {
    headers: {
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
