import { ChatRequest, ChatResponse, LeadRequest, LeadResponse } from "./types";
import { ChatResponseSchema, sanitizeSources } from "./schemas";

const TIMEOUT_MS = 25000;

export async function proxyChatToN8N(payload: ChatRequest): Promise<ChatResponse> {
  const webhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;
  const sharedSecret = process.env.N8N_SHARED_SECRET || "";

  if (!webhookUrl) {
    throw new Error("N8N_CHAT_WEBHOOK_URL is not configured");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sharedSecret ? { "x-api-key": sharedSecret } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Upstream returned HTTP ${res.status}`);
    }

    const data = await res.json();

    if (data && data.error) {
      const err = new Error(data.error.message || "Upstream service error");
      (err as unknown as { code?: string }).code = data.error.code || "upstream_error";
      throw err;
    }

    const parsed = ChatResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.error("Invalid upstream payload format:", parsed.error.format());
      throw new Error("Malformed upstream response schema");
    }

    // Sanitize source URLs to ensure defense-in-depth against untrusted domains
    return {
      ...parsed.data,
      sources: sanitizeSources(parsed.data.sources),
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      const err = new Error("Upstream n8n webhook timed out after 25s");
      err.name = "TimeoutError";
      throw err;
    }

    throw error;
  }
}

export async function proxyLeadToN8N(payload: LeadRequest): Promise<LeadResponse> {
  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
  const sharedSecret = process.env.N8N_SHARED_SECRET || "";

  if (!webhookUrl) {
    throw new Error("N8N_LEAD_WEBHOOK_URL is not configured");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sharedSecret ? { "x-api-key": sharedSecret } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Upstream returned HTTP ${res.status}`);
    }

    const data = await res.json().catch(() => ({}));
    if (data && data.error) {
      const err = new Error(data.error.message || "Lead submission rejected");
      (err as unknown as { code?: string }).code = data.error.code || "invalid_input";
      throw err;
    }

    return { ok: true };
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    throw error;
  }
}
