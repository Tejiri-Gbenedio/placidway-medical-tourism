"use client";

import { useState } from "react";
import { ExternalLink, ShieldCheck, XCircle, ChevronDown, ChevronUp, Database } from "lucide-react";
import { KNOWLEDGE_SOURCES } from "@/config/sources";
import { SuggestedQuestions } from "./SuggestedQuestions";

interface SourcesPanelProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

export function SourcesPanel({ onSelectQuestion, disabled }: SourcesPanelProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Mobile toggle button */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-surface border border-outline text-xs font-semibold text-ink shadow-soft"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-coral" />
            <span>Suggested Questions & Knowledge Base (7 Sources)</span>
          </div>
          {mobileExpanded ? (
            <ChevronUp className="w-4 h-4 text-ink-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-ink-muted" />
          )}
        </button>
      </div>

      <div
        className={`flex flex-col gap-5 ${
          mobileExpanded ? "block" : "hidden lg:flex"
        }`}
      >
        {/* Suggested Questions Block */}
        <div className="p-4 rounded-card bg-surface/90 border border-outline shadow-soft">
          <SuggestedQuestions onSelect={onSelectQuestion} disabled={disabled} />
        </div>

        {/* Knowledge Sources Accordion / List */}
        <div className="p-4 rounded-card bg-surface/90 border border-outline shadow-soft">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline">
            <div className="flex items-center gap-1.5 text-xs font-bold text-ink uppercase tracking-wider">
              <Database className="w-3.5 h-3.5 text-coral" />
              <span>Grounded Knowledge Sources</span>
            </div>
            <span className="text-[10px] font-mono text-ink-muted bg-peach-100 px-2 py-0.5 rounded-full border border-outline">
              7 Pages
            </span>
          </div>

          <p className="text-xs text-ink-muted mb-3 leading-relaxed">
            All answers are strictly synthesized from these public PlacidWay pages for <strong>Immunity Therapy Center</strong>:
          </p>

          <ul className="space-y-2">
            {KNOWLEDGE_SOURCES.map((source) => (
              <li key={source.id} className="text-xs">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-2 rounded-lg bg-page hover:bg-peach-100 border border-outline/70 hover:border-coral-border transition-all"
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="font-semibold text-ink group-hover:text-coral transition-colors line-clamp-1">
                      {source.shortTitle}
                    </span>
                    <ExternalLink className="w-3 h-3 text-ink-light group-hover:text-coral shrink-0 mt-0.5" />
                  </div>
                  <span className="text-[10px] text-ink-muted line-clamp-1 mt-0.5">
                    {source.description}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* What I can / can't do */}
        <div className="p-4 rounded-card bg-surface/90 border border-outline shadow-soft space-y-3">
          <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            <span>AI Guardrails & Capabilities</span>
          </h4>

          <div className="space-y-2 text-xs text-ink-muted">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Answers price and inclusions questions with exact citations.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Compares out-patient vs. in-patient clinical tiers.</span>
            </div>
            <div className="flex items-start gap-2">
              <XCircle className="w-3.5 h-3.5 text-coral shrink-0 mt-0.5" />
              <span><strong>No medical advice:</strong> Will not diagnose or evaluate clinical suitability.</span>
            </div>
            <div className="flex items-start gap-2">
              <XCircle className="w-3.5 h-3.5 text-coral shrink-0 mt-0.5" />
              <span><strong>No appointment booking:</strong> All bookings require physician review.</span>
            </div>
            <div className="flex items-start gap-2">
              <XCircle className="w-3.5 h-3.5 text-coral shrink-0 mt-0.5" />
              <span><strong>No hallucinations:</strong> Resists trick questions and says "I don't know" when facts are missing.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
