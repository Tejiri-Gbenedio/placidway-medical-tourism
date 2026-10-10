"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface DisclaimerNoteProps {
  onDismiss?: () => void;
}

export function DisclaimerNote({ onDismiss }: DisclaimerNoteProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mb-3 p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start justify-between gap-2.5 shadow-xs animate-fadeIn">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-amber-950">Important Medical Notice</p>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            This chatbot provides general information extracted strictly from public clinic pages. It does not provide medical diagnosis, personal treatment plans, or clinical safety determinations. Always consult your oncologist or physician.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setDismissed(true);
          onDismiss?.();
        }}
        className="text-amber-700 hover:text-amber-950 p-1 rounded-lg hover:bg-amber-100 transition-colors shrink-0"
        aria-label="Dismiss medical disclaimer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
