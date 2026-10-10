"use client";

import { CheckCircle2 } from "lucide-react";
import { QUOTE_URL } from "@/config/brand";

interface PlacidWayHeroProps {
  onOpenChatWithQuery?: (query?: string) => void;
}

export function PlacidWayHero(_props: PlacidWayHeroProps) {
  return (
    <section className="relative flex min-h-[580px] md:min-h-[660px] items-center overflow-hidden bg-[#1E2E48] text-white py-20 md:py-28 px-4 sm:px-6">
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

        {/* Clean Direct Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <a
            href={QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-coral hover:bg-coral-hover text-white text-sm font-bold shadow-soft transition-all active:scale-95 whitespace-nowrap"
          >
            Request a Free Quote
          </a>
          <a
            href="#treatments"
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-semibold transition-all active:scale-95 whitespace-nowrap"
          >
            Browse Treatments
          </a>
        </div>

        {/* Trust proofs */}
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
