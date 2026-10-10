import { ChatResponse } from "@/lib/types";
import { MOCK_SCENARIOS, FALLBACK_MOCK_RESPONSE } from "./responses";

export async function matchMockQuery(query: string): Promise<ChatResponse> {
  // Realistic network simulation delay (800ms - 1300ms)
  const delay = Math.floor(Math.random() * 500) + 800;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const normalized = query.toLowerCase().trim();

  // 1. Check exact or keyword scenario matches
  for (const scenario of MOCK_SCENARIOS) {
    const hasMatch = scenario.keywords.some((keyword) =>
      normalized.includes(keyword.toLowerCase())
    );
    if (hasMatch) {
      return scenario.response;
    }
  }

  // 2. Extra keyword catches
  if (normalized.includes("quote") || normalized.includes("free quote")) {
    return {
      ...FALLBACK_MOCK_RESPONSE,
      answer:
        "You can request a free personalized quote for Immunity Therapy Center directly through PlacidWay. The medical team will review your records and provide itemized pricing.",
      can_answer: true,
      show_quote_cta: true,
    };
  }

  if (normalized.includes("difference") || normalized.includes("in-patient")) {
    return {
      answer:
        "According to ITC's package listings:\n\n* **Out-Patient Program ($18,995 USD):** Includes daily doctor consultations, therapies, diagnostic work, and two meals a day while you stay in approved nearby lodging.\n* **In-Patient Program ($30,000 USD):** Includes all therapies plus full 24/7 hospital admission, private room accommodation, and continuous nursing support.",
      sources: [
        {
          title: "ITC Immunity Therapy Center – Price List",
          url: "https://www.placidway.com/price-list/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center",
        },
      ],
      can_answer: true,
      show_quote_cta: true,
      show_lead_form: false,
      show_disclaimer: false,
      language: "en",
      suggested_followups: [
        "What is included in the out-patient package?",
        "How do I request a free quote?",
      ],
    };
  }

  return FALLBACK_MOCK_RESPONSE;
}
