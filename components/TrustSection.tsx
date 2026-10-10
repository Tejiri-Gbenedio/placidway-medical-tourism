"use client";

import { ShieldCheck, TrendingDown, Users } from "lucide-react";

const PRICE_COMPARISONS = [
  { procedure: "Alternative Cancer Protocol (3 Wk)", usPrice: "$85,000+", abroadPrice: "$18,995", destination: "Tijuana, Mexico", savings: "78%" },
  { procedure: "All-on-4 Full Dental Implants", usPrice: "$28,000", abroadPrice: "$8,500", destination: "Mexico / Costa Rica", savings: "70%" },
  { procedure: "Gastric Sleeve Bariatric Surgery", usPrice: "$16,500", abroadPrice: "$4,200", destination: "Tijuana, Mexico", savings: "74%" },
  { procedure: "Knee Replacement (Single)", usPrice: "$35,000", abroadPrice: "$9,800", destination: "Mexico / Spain", savings: "72%" },
];

export function TrustSection() {
  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      <div className="bg-[#1E2E48] rounded-3xl p-6 sm:p-12 text-white shadow-card relative overflow-hidden">
        <div className="relative z-10 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-coral uppercase tracking-wider">
              Transparent Global Pricing
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Why Patients Choose PlacidWay
            </h2>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed">
              Real cost comparisons demonstrating the savings patients achieve without compromising clinical safety or quality of care.
            </p>
          </div>

          {/* Price Comparison Table with larger typography */}
          <div className="overflow-x-auto rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-white/10 text-white text-xs sm:text-sm uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4 sm:p-5">Medical Procedure</th>
                  <th className="p-4 sm:p-5">Average US Cost</th>
                  <th className="p-4 sm:p-5 text-coral font-bold">PlacidWay Partner Clinics</th>
                  <th className="p-4 sm:p-5 hidden sm:table-cell">Primary Destination</th>
                  <th className="p-4 sm:p-5 text-right">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/90">
                {PRICE_COMPARISONS.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">{row.procedure}</td>
                    <td className="p-4 sm:p-5 text-white/60 line-through">{row.usPrice}</td>
                    <td className="p-4 sm:p-5 font-bold text-coral">{row.abroadPrice}</td>
                    <td className="p-4 sm:p-5 hidden sm:table-cell text-white/80">{row.destination}</td>
                    <td className="p-4 sm:p-5 text-right">
                      <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                        {row.savings}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trust Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4 text-center sm:text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-coral/20 border border-coral flex items-center justify-center shrink-0 text-coral">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Vetted & Certified Clinics</h4>
                <p className="text-sm text-white/75 mt-1.5 leading-relaxed">
                  Every provider meets strict international hygiene, accreditation, and doctor credential checks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-coral/20 border border-coral flex items-center justify-center shrink-0 text-coral">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">No Hidden Markups</h4>
                <p className="text-sm text-white/75 mt-1.5 leading-relaxed">
                  Transparent itemized quotes provided upfront so you know exactly what your package covers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-coral/20 border border-coral flex items-center justify-center shrink-0 text-coral">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Dedicated Patient Coordinators</h4>
                <p className="text-sm text-white/75 mt-1.5 leading-relaxed">
                  Free one-on-one assistance with records review, clinic admissions, and travel logistics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
