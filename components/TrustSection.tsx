import { QUOTE_URL } from "@/config/brand";

const QUESTIONS = [
  {
    title: "What does the price include?",
    detail:
      "Ask for an itemized quote covering consultations, tests, treatment, medication, and follow-up. Check travel and accommodation separately.",
  },
  {
    title: "Who will provide my care?",
    detail:
      "Check the clinician’s qualifications, the facility’s current accreditation, and the evidence for your proposed treatment.",
  },
  {
    title: "What happens after I go home?",
    detail:
      "Discuss recovery time, complications, and follow-up with both your treating clinic and your doctor at home before booking.",
  },
];

export function TrustSection() {
  return (
    <section id="pricing" className="bg-[#182B49] text-white py-20 px-4 sm:px-6 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        {/* Split top row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-baseline">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            A better decision starts<br />with better questions.
          </h2>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
            The headline price is only part of the picture. Compare the full care plan, not just the cost, and involve your own doctor before making travel arrangements.
          </p>
        </div>

        {/* 3 Question Columns */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-white/20 pt-10">
          {QUESTIONS.map((q) => (
            <div key={q.title}>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {q.title}
              </h3>
              <p className="mt-3 text-sm text-white/75 leading-relaxed">
                {q.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA row */}
        <div className="mt-14 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-lg sm:text-xl font-medium text-white/90">
            Ready to ask about your options?
          </p>
          <a
            href={QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-white text-[#182B49] hover:bg-slate-100 text-sm font-bold shadow-soft transition-all active:scale-95 whitespace-nowrap"
          >
            Request a quote on PlacidWay
          </a>
        </div>
      </div>
    </section>
  );
}
