"use client";

import { useState } from "react";
import { CheckCircle2, Send, AlertCircle, Loader2 } from "lucide-react";

interface LeadFormProps {
  sessionId: string;
}

export function LeadForm({ sessionId }: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!consent) {
      setError("Please check the consent box to proceed");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          name: name.trim(),
          email: email.trim(),
          consent: true,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || "Could not submit your consultation request"
        );
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-status-greenBg border border-green-200 text-green-900 flex items-center gap-3 animate-fadeIn">
        <CheckCircle2 className="w-5 h-5 text-status-green shrink-0" />
        <div className="text-xs sm:text-sm">
          <p className="font-bold">Thank you for reaching out</p>
          <p className="text-green-800 mt-0.5">
            A PlacidWay patient advisor will review your request and connect with you shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 sm:p-5 rounded-xl bg-surface border border-outline shadow-soft">
      <div className="mb-3">
        <h4 className="text-xs sm:text-sm font-bold text-ink uppercase tracking-wider">
          Request Virtual Consultation & Custom Quote
        </h4>
        <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
          Receive confidential pricing and admissions guidance for Immunity Therapy Center.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label htmlFor="lead-name" className="block text-xs font-semibold text-ink-muted mb-1">
            Full Name
          </label>
          <input
            id="lead-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah Jenkins"
            disabled={loading}
            className="w-full px-3.5 py-2 rounded-lg border border-outline bg-page text-ink text-sm focus:bg-surface focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all"
          />
        </div>

        <div>
          <label htmlFor="lead-email" className="block text-xs font-semibold text-ink-muted mb-1">
            Email Address
          </label>
          <input
            id="lead-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. sarah@example.com"
            disabled={loading}
            className="w-full px-3.5 py-2 rounded-lg border border-outline bg-page text-ink text-sm focus:bg-surface focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all"
          />
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="lead-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={loading}
            className="mt-0.5 rounded text-coral focus:ring-coral h-4 w-4 border-outline cursor-pointer"
          />
          <label htmlFor="lead-consent" className="text-xs text-ink-muted leading-relaxed cursor-pointer">
            I consent to PlacidWay contacting me via email regarding treatment options and pricing quotes.
          </label>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-coral mt-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-pill bg-coral hover:bg-coral-hover text-white text-xs sm:text-sm font-bold shadow-soft active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Consultation Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
