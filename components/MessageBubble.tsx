"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { Info, AlertCircle, RefreshCw, User } from "lucide-react";
import { Message } from "@/lib/types";
import { SourceChips } from "./SourceChips";
import { QuoteCTA } from "./QuoteCTA";
import { LeadForm } from "./LeadForm";
import { DisclaimerNote } from "./DisclaimerNote";

interface MessageBubbleProps {
  message: Message;
  sessionId: string;
  hasShownDisclaimer: boolean;
  onDisclaimerShown?: () => void;
  onFollowupClick?: (query: string) => void;
  onRetry?: (rawInput?: string) => void;
}

export function MessageBubble({
  message,
  sessionId,
  hasShownDisclaimer,
  onDisclaimerShown,
  onFollowupClick,
  onRetry,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isError = message.isError;
  const isCannotAnswer = message.can_answer === false;

  // Custom link renderer restricting allowed protocols/hosts
  const components = {
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      if (!href) return <span>{children}</span>;

      const isAllowed =
        href.startsWith("https://www.placidway.com/") ||
        href.startsWith("https://placidway.com/") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:");

      if (!isAllowed) {
        return <span className="underline decoration-dotted">{children}</span>;
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-coral hover:text-coral-hover font-semibold underline underline-offset-2 transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    },
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-2.5 last:mb-0 leading-relaxed text-sm sm:text-base">{children}</p>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc pl-5 mb-2.5 last:mb-0 space-y-1.5 text-sm sm:text-base">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal pl-5 mb-2.5 last:mb-0 space-y-1.5 text-sm sm:text-base">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-[#1E2E48]">{children}</strong>
    ),
  };

  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-2.5 animate-fadeIn">
        <div className="max-w-[85%] sm:max-w-[78%] px-4 py-3 rounded-bubble rounded-br-sm bg-coral text-white shadow-soft">
          <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed font-normal">
            {message.content}
          </p>
          <span className="block text-xs text-white/75 text-right mt-1.5 font-mono">
            {message.timestamp}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-peach-200 flex items-center justify-center shrink-0 text-coral shadow-xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Error bubble
  if (isError) {
    return (
      <div className="flex items-start gap-3 max-w-[90%] sm:max-w-[82%] animate-fadeIn">
        <div className="w-9 h-9 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0 text-red-600 shadow-xs">
          <AlertCircle className="w-4 h-4" />
        </div>

        <div className="px-4 py-3.5 rounded-bubble rounded-tl-sm bg-red-50/80 border border-red-200 text-red-900 shadow-soft">
          <p className="text-sm leading-relaxed">{message.content}</p>

          {onRetry && (
            <button
              type="button"
              onClick={() => onRetry(message.rawInput)}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill bg-white hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-all shadow-xs active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry question</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Assistant bubble
  return (
    <div className="flex items-start gap-3 max-w-[92%] sm:max-w-[85%] animate-fadeIn">
      {/* Bot Avatar */}
      <div className="w-9 h-9 rounded-full bg-peach-100 border border-coral-border flex items-center justify-center shrink-0 shadow-xs mt-1">
        <Image
          src="/logo.svg"
          alt="Alice"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Medical disclaimer note if triggered and not yet shown this session */}
        {message.show_disclaimer && !hasShownDisclaimer && (
          <DisclaimerNote
            onDismiss={() => {
              onDisclaimerShown?.();
            }}
          />
        )}

        <div
          className={`px-4 py-4 rounded-bubble rounded-tl-sm shadow-soft text-ink ${
            isCannotAnswer
              ? "bg-page border-2 border-outline-subtle"
              : "bg-peach-100 border border-outline"
          }`}
        >
          {isCannotAnswer && (
            <div className="flex items-center gap-2 text-xs font-bold text-ink-muted mb-2.5 pb-2 border-b border-outline/50">
              <Info className="w-4 h-4 text-coral" />
              <span>Verified Information Boundary</span>
            </div>
          )}

          <div className="prose prose-sm sm:prose-base max-w-none text-ink leading-relaxed">
            <ReactMarkdown
              rehypePlugins={[rehypeSanitize]}
              components={components}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Source attribution badges */}
          <SourceChips sources={message.sources} />

          {/* Quote CTA Button */}
          {message.show_quote_cta && <QuoteCTA />}

          {/* Lead form card if user asked for booking/consultation */}
          {message.show_lead_form && <LeadForm sessionId={sessionId} />}

          {/* Suggested follow-up prompt chips */}
          {message.suggested_followups && message.suggested_followups.length > 0 && (
            <div className="mt-4 pt-3 border-t border-outline/60">
              <span className="block text-xs font-bold text-ink-muted mb-2 uppercase tracking-wider">
                Related Questions:
              </span>
              <div className="flex flex-wrap gap-2">
                {message.suggested_followups.slice(0, 3).map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onFollowupClick?.(prompt)}
                    className="text-left text-xs sm:text-sm px-3 py-1.5 rounded-pill bg-surface hover:bg-peach-200 text-ink border border-outline hover:border-coral-border active:scale-95 transition-all shadow-xs font-medium"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <span className="text-xs text-ink-muted ml-2 mt-1.5 font-mono">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
