import { ExternalLink, Phone, ShieldAlert } from "lucide-react";
import { CONTACT_PHONE, QUOTE_URL, DISCLAIMER_TEXT } from "@/config/brand";

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-outline py-8 px-4 sm:px-6 transition-colors mt-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Assessment disclaimer */}
        <div className="flex items-start gap-2.5 max-w-2xl text-xs sm:text-sm text-ink-muted leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-coral shrink-0 mt-0.5" />
          <p>{DISCLAIMER_TEXT}</p>
        </div>

        {/* Action quick links */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-sm font-semibold text-ink">
          <a
            href={`tel:${CONTACT_PHONE.replace(/[^0-9+]/g, "")}`}
            className="inline-flex items-center gap-2 hover:text-coral transition-colors"
          >
            <Phone className="w-4 h-4 text-coral" />
            <span>{CONTACT_PHONE}</span>
          </a>

          <span className="text-outline hidden sm:inline">•</span>

          <a
            href={QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-coral text-coral transition-colors"
          >
            <span>Request Free Quote</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
