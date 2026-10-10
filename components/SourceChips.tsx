import { ExternalLink, Bookmark } from "lucide-react";
import { Source } from "@/lib/types";

interface SourceChipsProps {
  sources?: Source[];
}

export function SourceChips({ sources }: SourceChipsProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-3.5 border-t border-outline/70 flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-bold text-ink-muted uppercase tracking-wider">
        <Bookmark className="w-3.5 h-3.5 text-coral" />
        <span>Verified Sources ({sources.length})</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {sources.map((source, idx) => (
          <a
            key={`${source.url}-${idx}`}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-ink bg-surface hover:bg-peach-100 hover:text-coral border border-outline hover:border-coral-border transition-all active:scale-95 group shadow-xs"
            title={`View official page on PlacidWay: ${source.title}`}
          >
            <span className="truncate max-w-[280px] sm:max-w-[360px]">
              {source.title}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-ink-muted group-hover:text-coral shrink-0 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}
