import { NextRequest, NextResponse } from "next/server";
import { LeadRequestSchema } from "@/lib/schemas";
import { proxyLeadToN8N } from "@/lib/n8n";
import { ApiError } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let rawBody;
  try {
    rawBody = await req.json();
  } catch {
    const errorBody: ApiError = {
      error: {
        code: "invalid_input",
        message: "Invalid JSON in request body",
      },
    };
    return NextResponse.json(errorBody, { status: 400 });
  }

  const parsed = LeadRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    const errorBody: ApiError = {
      error: {
        code: "invalid_input",
        message: parsed.error.issues[0]?.message || "Invalid input parameters",
      },
    };
    return NextResponse.json(errorBody, { status: 400 });
  }

  const useMock =
    process.env.USE_MOCK !== "false" || !process.env.N8N_LEAD_WEBHOOK_URL;

  try {
    if (useMock) {
      // Mock mode simulates brief storage delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      return NextResponse.json(
        { ok: true },
        { headers: { "X-Robots-Tag": "noindex, nofollow" } }
      );
    }

    const liveResult = await proxyLeadToN8N(parsed.data);
    return NextResponse.json(liveResult, {
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  } catch (error: unknown) {
    console.error("Lead submission error:", error);

    const errorBody: ApiError = {
      error: {
        code: "upstream_error",
        message: "Could not submit your consultation request. Please try again.",
      },
    };

    return NextResponse.json(errorBody, {
      status: 502,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }
}
