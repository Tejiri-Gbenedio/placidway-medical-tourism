"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { QUOTE_URL } from "@/config/brand";

interface ClinicSpotlightProps {
  onAskAboutITC?: (prompt: string) => void;
}

export function ClinicSpotlight(_props: ClinicSpotlightProps) {
  return (
    <section id="itc-spotlight" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      <div className="rounded-3xl bg-surface border-2 border-coral/30 shadow-card p-6 sm:p-10 relative overflow-hidden">
        {/* Top header badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-outline mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1E2E48] text-white uppercase tracking-wider">
              Assessment Clinical Focus
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-coral bg-peach-100 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5" />
              <span>Tijuana, Mexico</span>
            </span>
          </div>
        </div>

        {/* Clinic Information */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E2E48] tracking-tight">
            Immunity Therapy Center (ITC)
          </h2>

          <p className="text-sm sm:text-base text-ink leading-relaxed max-w-3xl">
            Specialized in alternative and holistic cancer treatments. ITC offers customized immunotherapies, hyperthermia, and non-invasive natural protocols under the daily supervision of licensed oncologists in Tijuana, Mexico.
          </p>

          {/* Program details and inclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-page border border-outline shadow-xs">
              <span className="text-xs font-bold text-coral uppercase tracking-wider block mb-1">
                3-Week Out-Patient Program
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#1E2E48] block">
                From $18,995 USD
              </span>
              <p className="text-xs sm:text-sm text-ink-muted mt-2.5 leading-relaxed">
                Includes daily doctor consultations, individualized therapies, weekly lab work, imaging studies, and two organic meals daily.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-page border border-outline shadow-xs">
              <span className="text-xs font-bold text-[#1E2E48] uppercase tracking-wider block mb-1">
                3-Week In-Patient Tier
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#1E2E48] block">
                $30,000 USD
              </span>
              <p className="text-xs sm:text-sm text-ink-muted mt-2.5 leading-relaxed">
                Full 24/7 private room hospital admission, dedicated nursing, continuous monitoring, and all clinical protocols.
              </p>
            </div>
          </div>

          {/* Clean Direct Action */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <a
              href={QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-coral hover:bg-coral-hover text-white text-sm font-bold shadow-soft transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>Request Free Consultation & Quote</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

