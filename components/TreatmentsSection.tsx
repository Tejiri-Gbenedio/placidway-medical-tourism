"use client";

import { Activity, Smile, Scissors, Heart, UserCheck, Baby, MessageSquare, MapPin } from "lucide-react";

interface TreatmentsSectionProps {
  onAskTreatment: (prompt: string) => void;
}

const TREATMENTS = [
  {
    title: "Alternative Cancer Therapy",
    tag: "Assessment Focus",
    destinations: "Tijuana (Mexico), Germany",
    description: "Holistic oncology protocols, hyperthermia, and personalized immunotherapy at Immunity Therapy Center.",
    price: "From $18,995 USD",
    prompt: "How much does lung cancer treatment cost at ITC in Tijuana?",
    icon: Activity,
    highlight: true,
  },
  {
    title: "Dental Implants & All-on-4",
    tag: "Popular",
    destinations: "Los Algodones (Mexico), Costa Rica",
    description: "Full mouth restoration, zirconia crowns, veneers, and oral surgery at certified dental centers.",
    price: "From $1,200 USD",
    prompt: "What dental procedures are available abroad?",
    icon: Smile,
  },
  {
    title: "Cosmetic & Plastic Surgery",
    tag: "Trending",
    destinations: "Cancun (Mexico), Turkey, Colombia",
    description: "Rhinoplasty, tummy tuck, liposuction, and breast surgery performed by board-certified plastic surgeons.",
    price: "From $3,500 USD",
    prompt: "What is the average cost for plastic surgery abroad?",
    icon: Scissors,
  },
  {
    title: "Stem Cell & Regenerative Care",
    tag: "Advanced",
    destinations: "Mexico, Panama, Colombia",
    description: "High-viability mesenchymal stem cell protocols for joint regeneration, anti-aging, and autoimmune therapy.",
    price: "From $4,500 USD",
    prompt: "What stem cell therapy options exist in Mexico?",
    icon: Heart,
  },
  {
    title: "Bariatric / Weight Loss Surgery",
    tag: "High Demand",
    destinations: "Tijuana (Mexico), Turkey",
    description: "Gastric sleeve, gastric bypass, and revision bariatrics with comprehensive post-op nutrition counseling.",
    price: "From $4,200 USD",
    prompt: "What is included in a gastric sleeve package in Mexico?",
    icon: UserCheck,
  },
  {
    title: "IVF & Fertility Treatments",
    tag: "Specialized",
    destinations: "Mexico, Czech Republic, Greece",
    description: "In-vitro fertilization, ICSI, egg donation, and genetic screening with leading success rates.",
    price: "From $5,800 USD",
    prompt: "How do IVF fertility packages compare abroad?",
    icon: Baby,
  },
];

export function TreatmentsSection({ onAskTreatment }: TreatmentsSectionProps) {
  return (
    <section id="treatments" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-bold text-coral uppercase tracking-wider">
          Explore Popular Medical Procedures
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E2E48] tracking-tight">
          Find Affordable, World-Class Medical Care
        </h2>
        <p className="text-sm sm:text-base text-ink-muted max-w-2xl mx-auto leading-relaxed">
          Compare transparent prices and certified hospital options across leading medical tourism destinations worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TREATMENTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                item.highlight
                  ? "bg-peach-50/80 border-coral/40 shadow-soft ring-1 ring-coral/20"
                  : "bg-surface border-outline hover:border-coral-border hover:shadow-soft"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      item.highlight ? "bg-coral text-white" : "bg-peach-100 text-coral"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      item.highlight
                        ? "bg-coral text-white"
                        : "bg-page text-ink-muted border border-outline"
                    }`}
                  >
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-bold text-[#1E2E48] text-lg leading-snug">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-coral mt-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.destinations}</span>
                </div>

                <p className="text-sm text-ink-muted leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-outline flex items-center justify-between">
                <div>
                  <span className="text-xs text-ink-muted block uppercase font-medium">Starting from</span>
                  <span className="text-base font-black text-[#1E2E48]">{item.price}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onAskTreatment(item.prompt)}
                  className="px-3.5 py-2 rounded-pill bg-white hover:bg-peach-100 text-ink border border-outline text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-coral" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
