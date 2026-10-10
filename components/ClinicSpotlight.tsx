"use client";

import { MapPin, ExternalLink, MessageSquare, ArrowRight } from "lucide-react";
import { KNOWLEDGE_SOURCES } from "@/config/sources";
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

          <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">
            Verified Knowledge Sources: 7 Pages
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Clinic Information */}
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E2E48] tracking-tight">
              Immunity Therapy Center (ITC)
            </h2>

            <p className="text-sm sm:text-base text-ink leading-relaxed">
              Specialized in alternative and holistic cancer treatments. ITC offers customized immunotherapies, hyperthermia, and non-invasive natural protocols under the daily supervision of licensed oncologists in Tijuana, Mexico.
            </p>

            {/* Program details and inclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-page border border-outline">
                <span className="text-xs font-bold text-coral uppercase tracking-wider block mb-1">
                  3-Week Out-Patient Program
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#1E2E48] block">
                  From $18,995 USD
                </span>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
                  Includes daily doctor consultations, individualized therapies, weekly lab work, imaging studies, and two organic meals daily.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-page border border-outline">
                <span className="text-xs font-bold text-[#1E2E48] uppercase tracking-wider block mb-1">
                  3-Week In-Patient Tier
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#1E2E48] block">
                  $30,000 USD
                </span>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
                  Full 24/7 private room hospital admission, dedicated nursing, continuous monitoring, and all clinical protocols.
                </p>
              </div>
            </div>

            {/* Clean Direct Action */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
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

          {/* 7 Knowledge Source Badges on the right */}
          <div className="lg:col-span-5 bg-page p-6 rounded-2xl border border-outline shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline">
              <span className="text-xs font-bold text-[#1E2E48] uppercase tracking-wider">
                Official Source Pages
              </span>
              <span className="text-xs font-bold text-coral">
                PlacidWay Verified
              </span>
            </div>

            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              The chatbot answers visitor questions strictly using these published clinic listings:
            </p>

            <div className="space-y-2">
              {KNOWLEDGE_SOURCES.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface hover:bg-peach-100 border border-outline text-xs sm:text-sm text-ink group transition-all"
                >
                  <span className="font-semibold group-hover:text-coral truncate pr-2">
                    {s.shortTitle}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-muted group-hover:text-coral shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
