"use client";

import { useState } from "react";
import { Search, MapPin, MessageSquare, CheckCircle2 } from "lucide-react";

interface PlacidWayHeroProps {
  onOpenChatWithQuery: (query?: string) => void;
}

export function PlacidWayHero({ onOpenChatWithQuery }: PlacidWayHeroProps) {
  const [treatmentQuery, setTreatmentQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (treatmentQuery.trim()) {
      onOpenChatWithQuery(
        `What can you tell me about ${treatmentQuery} in ${destinationQuery || "Mexico"}?`
      );
    } else {
      onOpenChatWithQuery("How much does lung cancer treatment cost at ITC in Tijuana?");
    }
  };

  return (
    <section className="relative flex min-h-[640px] md:min-h-[720px] items-center overflow-hidden bg-[#1E2E48] text-white py-16 md:py-24 px-4 sm:px-6">
      {/* Background Video Loop with clear visibility */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.92] contrast-[1.02]"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        <source src="/videos/Doctor_consulting_patient_by_window_20261009145334.mp4" type="video/mp4" />
      </video>

      {/* Light subtle overlay so video shows through brightly while text remains legible */}
      <div className="absolute inset-0 bg-slate-950/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1524]/65 via-transparent to-[#0B1524]/30" />

      {/* Hero Content */}
      <div className="max-w-5xl mx-auto relative z-10 w-full text-center space-y-6">
        {/* Subtle category tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-white/95">
          <span>Global Medical Tourism & Trusted Healthcare Abroad</span>
        </div>

        {/* Authentic PlacidWay headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md">
          PlacidWay – Your Way to Hope
        </h1>

        {/* Authentic PlacidWay subtitle with larger legible font */}
        <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-sm">
          Because every patient deserves a way forward. When local healthcare says &ldquo;no,&rdquo; &ldquo;not covered,&rdquo; or &ldquo;the wait is too long,&rdquo; you are not out of options. We help you find trusted, affordable care abroad.
        </p>

        {/* Search Engine Filter Card with larger, legible typography */}
        <div className="max-w-3xl mx-auto mt-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-floating p-4 sm:p-5 text-ink border border-white/20">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3">
            {/* Treatment input */}
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-page border border-outline focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20 transition-all">
              <Search className="w-5 h-5 text-coral shrink-0" />
              <input
                type="text"
                value={treatmentQuery}
                onChange={(e) => setTreatmentQuery(e.target.value)}
                placeholder="What kind of care are you looking for? (e.g. Alternative Cancer, Dental)..."
                className="w-full bg-transparent text-sm sm:text-base text-ink placeholder:text-ink-muted focus:outline-none"
              />
            </div>

            {/* Destination input */}
            <div className="w-full md:w-60 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-page border border-outline focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20 transition-all">
              <MapPin className="w-5 h-5 text-coral shrink-0" />
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                placeholder="Where? (e.g. Tijuana, Mexico)..."
                className="w-full bg-transparent text-sm sm:text-base text-ink placeholder:text-ink-muted focus:outline-none"
              />
            </div>

            {/* Action buttons */}
            <div className="w-full md:w-auto flex items-center gap-2.5">
              <button
                type="submit"
                className="flex-1 md:flex-none px-6 py-3.5 rounded-xl bg-[#1E2E48] hover:bg-[#152033] text-white text-sm font-bold shadow-soft transition-all active:scale-95 whitespace-nowrap"
              >
                Explore Options
              </button>

              <button
                type="button"
                onClick={() =>
                  onOpenChatWithQuery(
                    treatmentQuery
                      ? `Tell me about ${treatmentQuery} in ${destinationQuery || "Mexico"}`
                      : undefined
                  )
                }
                className="flex-1 md:flex-none px-5 py-3.5 rounded-xl bg-coral hover:bg-coral-hover text-white text-sm font-bold shadow-soft transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                <span>AI Assistant</span>
              </button>
            </div>
          </form>
        </div>

        {/* Trust proofs below search bar */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-white/90 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-coral shrink-0" />
            <span>2,000+ Certified Global Clinics</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-coral shrink-0" />
            <span>Up to 70% Savings vs US / Canada</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-coral shrink-0" />
            <span>JCI Accredited Hospitals</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-coral shrink-0" />
            <span>Free Verified Quotes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
