import { NextRequest, NextResponse } from "next/server";
import { ChatRequestSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rateLimit";
import { matchMockQuery } from "@/lib/mock/matcher";
import { proxyChatToN8N } from "@/lib/n8n";
import { ApiError } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // 1. IP Rate Limiting
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const limitPerMin = parseInt(process.env.RATE_LIMIT_PER_MIN || "20", 10);

  const rateCheck = checkRateLimit(ip, limitPerMin);
  if (!rateCheck.allowed) {
    const errorBody: ApiError = {
      error: {
        code: "rate_limited",
        message: "Too many messages sent. Please wait a moment before trying again.",
      },
    };
    return NextResponse.json(errorBody, {
      status: 429,
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "Retry-After": "60",
      },
    });
  }

  // 2. Body Validation
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

  const parsed = ChatRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    const errorBody: ApiError = {
      error: {
        code: "invalid_input",
        message: parsed.error.issues[0]?.message || "Invalid input parameters",
      },
    };
    return NextResponse.json(errorBody, { status: 400 });
  }

  const { sessionId, message, channel } = parsed.data;

  // 3. Mode Switch: Mock vs Live
  const useMock =
    process.env.USE_MOCK !== "false" || !process.env.N8N_CHAT_WEBHOOK_URL;

  try {
    if (useMock) {
      const mockResult = await matchMockQuery(message);
      return NextResponse.json(mockResult, {
        headers: { "X-Robots-Tag": "noindex, nofollow" },
      });
    }

    // Proxy to live n8n
    const liveResult = await proxyChatToN8N({ sessionId, message, channel });
    return NextResponse.json(liveResult, {
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);

    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.message.includes("timed out"));

    const code = isTimeout ? "upstream_timeout" : "upstream_error";
    const statusCode = isTimeout ? 504 : 502;
    const userMessage = isTimeout
      ? "The assistant took too long to reply. Please click Retry."
      : error instanceof Error && error.message
      ? error.message
      : "The assistant encountered a temporary connection issue. Please click Retry.";

    const errorBody: ApiError = {
      error: {
        code,
        message: userMessage,
      },
    };

    return NextResponse.json(errorBody, {
      status: statusCode,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }
}
