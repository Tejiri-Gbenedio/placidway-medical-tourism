import { FileText, ArrowRight } from "lucide-react";
import { QUOTE_URL } from "@/config/brand";

interface QuoteCTAProps {
  label?: string;
}

export function QuoteCTA({ label = "Request a Free Quote" }: QuoteCTAProps) {
  return (
    <div className="mt-4">
      <a
        href={QUOTE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-xs sm:text-sm font-bold text-white bg-coral hover:bg-coral-hover active:scale-95 shadow-soft transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40"
      >
        <FileText className="w-4 h-4" />
        <span>{label}</span>
        <ArrowRight className="w-4 h-4 ml-0.5" />
      </a>
    </div>
  );
}
