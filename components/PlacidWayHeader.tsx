"use client";

import Image from "next/image";
import { MessageSquare, Phone } from "lucide-react";
import { CONTACT_PHONE, QUOTE_URL } from "@/config/brand";

interface PlacidWayHeaderProps {
  onOpenChat: () => void;
  mode: "mock" | "live";
}

export function PlacidWayHeader({ onOpenChat, mode }: PlacidWayHeaderProps) {
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
            <span className="bg-coral text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {mode === "live" ? "Live n8n Backend" : "Verified Mock Engine"}
            </span>
            <a
              href={`tel:${CONTACT_PHONE.replace(/[^0-9+]/g, "")}`}
              className="hidden md:inline-flex items-center gap-1.5 text-white/85 hover:text-white transition-colors font-medium text-xs"
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

        {/* Action triggers */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenChat}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-peach-100 hover:bg-peach-200 text-coral border border-coral-border font-bold text-sm shadow-soft transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-coral" />
            <span>Chat with Alice</span>
          </button>

          <a
            href={QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-pill bg-[#1E2E48] hover:bg-[#152033] text-white text-sm font-semibold shadow-soft transition-all active:scale-95"
          >
            Get Free Quote
          </a>
        </div>
      </div>
    </header>
  );
}
