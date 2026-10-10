export interface KnowledgeSource {
  id: string;
  title: string;
  shortTitle: string;
  url: string;
  page_type: "Clinic profile" | "Treatment package" | "Clinic videos" | "Price list" | "Price comparison";
  description: string;
  last_refreshed: string;
}

export const KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  {
    id: "itc-profile",
    title: "ITC Immunity Therapy Center Profile - Alternative Cancer Treatment",
    shortTitle: "ITC Clinic Profile",
    url: "https://www.placidway.com/profile/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center",
    page_type: "Clinic profile",
    description: "Accreditation, medical team, facility overview, and virtual consultation options in Tijuana, Mexico.",
    last_refreshed: "2026-10-07",
  },
  {
    id: "itc-adenocarcinoma",
    title: "Alternative Adenocarcinoma Cancer Treatment Package in Tijuana Mexico by ITC",
    shortTitle: "Adenocarcinoma Package",
    url: "https://www.placidway.com/package/7903/Alternative-Adenocarcinoma-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC",
    page_type: "Treatment package",
    description: "Detailed 3-week out-patient and in-patient inclusions, pricing from $18,995, and daily schedule.",
    last_refreshed: "2026-10-07",
  },
  {
    id: "itc-adrenal",
    title: "Alternative Adrenal Cancer Treatment Package in Tijuana Mexico by ITC",
    shortTitle: "Adrenal Cancer Package",
    url: "https://www.placidway.com/package/7902/Alternative-Adrenal-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC",
    page_type: "Treatment package",
    description: "Inclusions, natural therapies, weekly diagnostics, and pricing options starting from $18,995.",
    last_refreshed: "2026-10-07",
  },
  {
    id: "itc-anal",
    title: "Alternative Anal Cancer Treatment Package in Tijuana Mexico by ITC",
    shortTitle: "Anal Cancer Package",
    url: "https://www.placidway.com/package/7901/Alternative-Anal-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC",
    page_type: "Treatment package",
    description: "Comprehensive 3-week therapeutic protocol, laboratory monitoring, and program specifications.",
    last_refreshed: "2026-10-07",
  },
  {
    id: "itc-videos",
    title: "ITC Tijuana Videos - Alternative Cancer Treatment Patient Stories",
    shortTitle: "ITC Patient Videos",
    url: "https://www.placidway.com/profile-videos/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center",
    page_type: "Clinic videos",
    description: "Patient video testimonials, doctor interviews, and clinic tour walkthroughs.",
    last_refreshed: "2026-10-07",
  },
  {
    id: "itc-price-list",
    title: "ITC Immunity Therapy Center - Official Price List",
    shortTitle: "ITC Price List",
    url: "https://www.placidway.com/price-list/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center",
    page_type: "Price list",
    description: "Listed treatment costs, currency specifications (USD), and outpatient program rates ($18,995).",
    last_refreshed: "2026-10-07",
  },
  {
    id: "alt-med-comparison",
    title: "Alternative Medicine Cost Abroad - Compare Prices 2026",
    shortTitle: "Cost Comparison Abroad",
    url: "https://www.placidway.com/search-medical-pricings/Alternative-Medicine/All/1",
    page_type: "Price comparison",
    description: "Cross-country price benchmarks comparing Mexico, Thailand, Germany, and USA averages.",
    last_refreshed: "2026-10-07",
  },
];
