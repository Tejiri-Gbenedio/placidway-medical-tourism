"use client";

import { Sparkles } from "lucide-react";

export const DEFAULT_SUGGESTIONS = [
  "How much does lung cancer treatment cost at ITC in Tijuana?",
  "What's included in the out-patient package?",
  "What's the difference between out-patient and in-patient pricing?",
  "Is cancer treatment cheaper in Mexico or Thailand?",
  "And what about recovery time?",
  "Can you book me an appointment for tomorrow?",
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestions({ onSelect, disabled }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-bold text-ink uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-coral" />
        <span>Try Asking These Questions</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {DEFAULT_SUGGESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(q)}
            disabled={disabled}
            className="text-left px-3 py-2 rounded-xl text-xs font-medium text-ink bg-surface hover:bg-peach-100 hover:text-coral border border-outline hover:border-coral-border shadow-xs active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-start justify-between gap-2"
          >
            <span>{q}</span>
            <span className="text-coral opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
