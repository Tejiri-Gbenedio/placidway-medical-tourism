import { ChatResponse } from "@/lib/types";

export interface MockScenario {
  id: string;
  keywords: string[];
  response: ChatResponse;
}

export const MOCK_SCENARIOS: MockScenario[] = [
  // 1. Trick price ($50) - Evaluated first to prevent generic "cost" collision
  {
    id: "trick-price",
    keywords: ["$50", "50 dollars", "50$", "costs 50", "cost $50", "cost 50"],
    response: {
      answer:
        "I cannot confirm that price. That claim is incorrect.\n\nAccording to the official **ITC Price List**, alternative cancer programs begin at **USD $18,995** for the 3-week out-patient program and **USD $30,000** for in-patient care. There are no treatments or packages listed for $50.",
      sources: [
        {
          title: "ITC Immunity Therapy Center - Price List",
          url: "https://www.placidway.com/price-list/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center",
        },
      ],
      can_answer: true,
      show_quote_cta: true,
      show_lead_form: false,
      show_disclaimer: false,
      language: "en",
      suggested_followups: [
        "How much does lung cancer treatment cost at ITC in Tijuana?",
        "What is included in the out-patient package?",
        "Which cancer types are on the price list?",
      ],
    },
  },

  // 2. Booking appointment / Lead form
  {
    id: "booking-appointment",
    keywords: ["book", "appointment", "schedule", "tomorrow", "reserve"],
    response: {
      answer:
        "I cannot book an appointment for tomorrow. The clinic profile notes that immediate walk-ins are not accommodated, as ITC's medical board must first review comprehensive patient diagnostic records.\n\nHowever, you can request a **Virtual Medical Consultation and Free Quote**. Please submit your contact details below, and a PlacidWay patient advisor will guide you through admissions.",
      sources: [
        {
          title: "ITC Immunity Therapy Center Profile - Alternative Cancer Treatment",
          url: "https://www.placidway.com/profile/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center",
        },
      ],
      can_answer: false,
      show_quote_cta: true,
      show_lead_form: true,
      show_disclaimer: false,
      language: "en",
      suggested_followups: [
        "How much does lung cancer treatment cost at ITC in Tijuana?",
        "What is included in the out-patient package?",
      ],
    },
  },

  // 3. Medical advice / Diabetes safety
  {
    id: "medical-advice",
    keywords: ["diabetes", "safe for my", "medical advice", "cure", "prescribe", "safe for me", "diagnosis"],
    response: {
      answer:
        "I cannot provide personalized medical diagnosis or determine whether this protocol is safe for your diabetes or specific medical condition.\n\nPlease discuss any alternative oncology therapies with your primary physician. You can also request a free preliminary consultation with ITC's medical team to review your specific health history.",
      sources: [
        {
          title: "ITC Immunity Therapy Center Profile - Alternative Cancer Treatment",
          url: "https://www.placidway.com/profile/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center",
        },
      ],
      can_answer: false,
      show_quote_cta: true,
      show_lead_form: false,
      show_disclaimer: true,
      language: "en",
      suggested_followups: [
        "How do I request a free quote?",
        "What is included in the out-patient package?",
      ],
    },
  },

  // 4. Follow-up: Recovery time
  {
    id: "recovery-time",
    keywords: ["recovery", "recovery time", "heal", "how long to recover"],
    response: {
      answer:
        "The published source pages do not state a specific recovery timeframe. Because alternative cancer therapy protocols are non-invasive and focus on immune restoration, patient recuperation varies individually.\n\nThe pages do confirm a structured **3-week clinical program itinerary** at ITC in Tijuana, followed by an ongoing home regimen and a **3-month follow-up medical review**.",
      sources: [
        {
          title: "ITC Immunity Therapy Center Profile - Alternative Cancer Treatment",
          url: "https://www.placidway.com/profile/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center",
        },
      ],
      can_answer: false,
      show_quote_cta: true,
      show_lead_form: false,
      show_disclaimer: false,
      language: "en",
      suggested_followups: [
        "What is included in the out-patient package?",
        "How do I request a free quote?",
      ],
    },
  },

  // 5. Comparison question
  {
    id: "comparison-mexico-thailand",
    keywords: ["thailand", "cheaper", "compare", "difference", "versus", "vs"],
    response: {
      answer:
        "According to the **Alternative Medicine Cost Abroad** comparison page:\n\n* **Mexico (ITC Tijuana):** Comprehensive 3-week out-patient programs start from **$18,995 USD**.\n* **Thailand:** Specialized alternative cancer protocols average from **$24,000 USD** on comparable listings.\n\n*Please note:* These are starting baseline figures. Final medical expenses depend on cancer stage, diagnostic requirements, and in-patient vs. out-patient selection.",
      sources: [
        {
          title: "Alternative Medicine Cost Abroad - Compare Prices 2026",
          url: "https://www.placidway.com/search-medical-pricings/Alternative-Medicine/All/1",
        },
        {
          title: "ITC Immunity Therapy Center - Price List",
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
        "Which cancer types are on the price list?",
      ],
    },
  },

  // 6. Procedure / package inclusions
  {
    id: "package-inclusions",
    keywords: ["included", "inclusions", "package include", "what's included", "what is included"],
    response: {
      answer:
        "The **3-week out-patient program** at ITC in Tijuana includes:\n\n* **Daily Doctor Consultations:** Licensed oncologists and integrative doctors review progress daily.\n* **Personalized Therapies:** Complete daily holistic protocols (hyperthermia, immunotherapy, oxygen therapies, and targeted natural IVs).\n* **Diagnostic Work:** Weekly laboratory testing and one complete imaging evaluation.\n* **Nutrition:** Two organic, chef-prepared meals daily tailored to patient dietary guidelines.\n* **Post-Care Medications:** Standard supply of continuation supplements and medications for home transition.\n* **Follow-up Care:** One formal telehealth follow-up consultation 3 months post-program.",
      sources: [
        {
          title: "Alternative Adenocarcinoma Cancer Treatment Package in Tijuana Mexico by ITC",
          url: "https://www.placidway.com/package/7903/Alternative-Adenocarcinoma-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC",
        },
      ],
      can_answer: true,
      show_quote_cta: true,
      show_lead_form: false,
      show_disclaimer: false,
      language: "en",
      suggested_followups: [
        "Which procedures cost extra?",
        "What's the difference between out-patient and in-patient pricing?",
        "How do I request a free quote?",
      ],
    },
  },

  // 7. Cost question
  {
    id: "cost-lung-cancer",
    keywords: ["lung", "cost", "how much", "price", "rate", "$18,995", "pricing"],
    response: {
      answer:
        "Based on the official **ITC Immunity Therapy Center Price List**, alternative cancer therapy for lung cancer is listed at **USD $18,995** (listed out-patient package price).\n\nThe published package specifications detail two core tiers:\n* **3-Week Out-Patient Program:** Starts from **$18,995 USD**\n* **3-Week In-Patient Program:** **$30,000 USD** (includes 24/7 dedicated nursing and private hospital room accommodation)\n\nAll rates include daily physician evaluations, individualized natural therapies, and weekly lab monitoring.",
      sources: [
        {
          title: "ITC Immunity Therapy Center - Price List",
          url: "https://www.placidway.com/price-list/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center",
        },
        {
          title: "Alternative Adenocarcinoma Cancer Treatment in Tijuana",
          url: "https://www.placidway.com/package/7903/Alternative-Adenocarcinoma-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC",
        },
      ],
      can_answer: true,
      show_quote_cta: true,
      show_lead_form: false,
      show_disclaimer: false,
      language: "en",
      suggested_followups: [
        "What is included in the out-patient package?",
        "What's the difference between out-patient and in-patient pricing?",
        "How do I request a free quote?",
      ],
    },
  },

  // 8. Out of scope
  {
    id: "out-of-scope-weather",
    keywords: ["weather", "cancun", "hotel", "flight", "tourism", "vacation"],
    response: {
      answer:
        "I cannot provide weather or tourist information. I am a specialized medical knowledge assistant focused strictly on **Immunity Therapy Center (ITC) in Tijuana, Mexico**.\n\nI can provide verified facts on cancer treatment programs, published price lists, package inclusions, and quote requests.",
      sources: [],
      can_answer: false,
      show_quote_cta: false,
      show_lead_form: false,
      show_disclaimer: false,
      language: "en",
      suggested_followups: [
        "How much does lung cancer treatment cost at ITC in Tijuana?",
        "What is included in the out-patient package?",
        "Which cancer types are on the price list?",
      ],
    },
  },
];

export const FALLBACK_MOCK_RESPONSE: ChatResponse = {
  answer:
    "I couldn't find that specific information in the 7 published knowledge pages for **Immunity Therapy Center (Tijuana)**.\n\nTo avoid providing unverified details, please request a free personalized quote or speak directly with a PlacidWay patient coordinator.",
  sources: [],
  can_answer: false,
  show_quote_cta: true,
  show_lead_form: false,
  show_disclaimer: false,
  language: "en",
  suggested_followups: [
    "How much does lung cancer treatment cost at ITC in Tijuana?",
    "What is included in the out-patient package?",
    "How do I request a free quote?",
  ],
};
