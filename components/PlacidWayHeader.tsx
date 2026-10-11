"use client";

import Image from "next/image";
import { MessageSquare, Phone } from "lucide-react";
import { CONTACT_PHONE, QUOTE_URL } from "@/config/brand";

interface PlacidWayHeaderProps {
  onOpenChat?: () => void;
  mode?: "mock" | "live";
}

export function PlacidWayHeader({ mode = "live" }: PlacidWayHeaderProps) {
  return (
    <header className="w-full sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline shadow-xs">
      {/* Top assessment notice banner */}
      <div className="bg-[#1E2E48] text-white py-2 px-4 text-xs font-medium">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-green" />
            <span className="hidden sm:inline">
              PlacidWay AI Automation Assessment • Grounded Knowledge Chatbot
            </span>
            <span className="sm:hidden">PlacidWay AI Assessment</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${CONTACT_PHONE.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center gap-1.5 text-white/85 hover:text-white transition-colors font-medium text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-coral" />
              <span>{CONTACT_PHONE}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-coral flex items-center justify-center shadow-soft group-hover:bg-coral-hover transition-colors">
              <Image
                src="/logo.svg"
                alt="PlacidWay Logo"
                width={28}
                height={28}
                className="w-7 h-7"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#1E2E48] tracking-tight font-sans">
                Placid<span className="text-coral">Way</span>
              </span>
              <span className="text-xs font-bold text-ink-muted -mt-1 tracking-wider uppercase">
                Global Medical Tourism
              </span>
            </div>
          </a>
        </div>

        {/* Center navigation links with larger readable fonts */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-ink">
          <a href="#treatments" className="hover:text-coral transition-colors">
            Treatments
          </a>
          <a href="#itc-spotlight" className="text-coral font-bold hover:text-coral-hover transition-colors">
            ITC Tijuana Spotlight
          </a>
          <a href="#destinations" className="hover:text-coral transition-colors">
            Destinations
          </a>
          <a href="#pricing" className="hover:text-coral transition-colors">
            Pricing & Savings
          </a>
          <a
            href={QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-coral transition-colors"
          >
            Free Quote
          </a>
        </nav>

        {/* Action trigger */}
        <div className="flex items-center gap-3">
          <a
            href={QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#1E2E48] hover:bg-[#152033] text-white text-xs sm:text-sm font-semibold whitespace-nowrap shadow-soft transition-all active:scale-95"
          >
            Get Free Quote
          </a>
        </div>
      </div>
    </header>
  );
}
