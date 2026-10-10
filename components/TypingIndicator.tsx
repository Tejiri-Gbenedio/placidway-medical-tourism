import Image from "next/image";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%] animate-fadeIn">
      {/* Assistant avatar */}
      <div className="w-8 h-8 rounded-full bg-peach-100 border border-coral-border flex items-center justify-center shrink-0 shadow-xs">
        <Image
          src="/logo.svg"
          alt="Clarity Assistant"
          width={18}
          height={18}
          className="w-4 h-4"
        />
      </div>

      <div className="px-4 py-3 rounded-bubble rounded-tl-sm bg-peach-100 border border-outline text-ink shadow-soft flex items-center gap-1.5">
        <span className="text-xs text-ink-muted mr-1">Researching clinic sources</span>
        <span className="w-1.5 h-1.5 rounded-full bg-coral animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-coral animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-coral animate-bounce" />
      </div>
    </div>
  );
}
