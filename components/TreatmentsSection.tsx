import { QUOTE_URL } from "@/config/brand";

interface TreatmentsSectionProps {
  onAskTreatment?: (prompt: string) => void;
}

const TREATMENTS = [
  {
    title: "Cancer care",
    description:
      "Questions to discuss with your oncology team: treatment goals, evidence, eligibility, and how care abroad would fit your current plan.",
  },
  {
    title: "Dental care",
    description:
      "Explore implants, crowns, and restoration. Ask about assessment, materials, the number of visits, and follow-up care.",
  },
  {
    title: "Cosmetic surgery",
    description:
      "Consider procedure options, surgeon qualifications, recovery time, and the support you may need before travelling home.",
  },
  {
    title: "Regenerative medicine",
    description:
      "Ask about the evidence for your condition, regulatory status, potential risks, and whether a treatment is investigational.",
  },
  {
    title: "Weight-loss surgery",
    description:
      "Discuss surgical eligibility, nutritional support, recovery, and arrangements for ongoing care after your return.",
  },
  {
    title: "Fertility care",
    description:
      "Consider assessment, treatment schedules, medication, local eligibility rules, and the practicalities of repeat visits.",
  },
];

export function TreatmentsSection(_props: TreatmentsSectionProps) {
  return (
    <section id="treatments" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full scroll-mt-24">
      {/* Header split row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 mb-12 items-baseline">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E2E48] tracking-tight leading-tight">
          What kind of care<br className="hidden md:inline" /> are you exploring?
        </h2>
        <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
          Start with a treatment area. These are useful questions for a provider conversation; availability and suitability depend on your individual assessment.
        </p>
      </div>

      {/* 3-Column Clean Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
        {TREATMENTS.map((item) => (
          <article key={item.title} className="border-t border-[#1E2E48]/20 pt-6">
            <h3 className="text-xl font-bold text-[#1E2E48] tracking-tight">
              {item.title}
            </h3>
            <p className="mt-3 text-sm text-ink-muted leading-relaxed">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      {/* Bottom subtle quote trigger */}
      <div className="mt-12 pt-8 border-t border-[#1E2E48]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-ink-muted">
          Ready to discuss a treatment? Share your needs in a quote request.
        </p>
        <a
          href={QUOTE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-coral hover:text-coral-hover inline-flex items-center gap-1 transition-colors"
        >
          <span>Request a treatment quote</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  );
}
