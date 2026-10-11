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
        return <span className="underline decoration-dotted break-all">{children}</span>;
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-coral hover:text-coral-hover font-medium underline underline-offset-2 break-all [overflow-wrap:anywhere] transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    },
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-2.5 last:mb-0 leading-relaxed text-sm sm:text-base break-words [overflow-wrap:anywhere]">{children}</p>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc pl-5 mb-2.5 last:mb-0 space-y-1.5 text-sm sm:text-base break-words [overflow-wrap:anywhere]">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal pl-5 mb-2.5 last:mb-0 space-y-1.5 text-sm sm:text-base break-words [overflow-wrap:anywhere]">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed break-words [overflow-wrap:anywhere]">{children}</li>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-[#1E2E48]">{children}</strong>
    ),
  };

  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-2.5 animate-fadeIn">
        <div className="max-w-[85%] sm:max-w-[78%] px-4 py-3 rounded-2xl rounded-br-sm bg-coral text-white shadow-xs break-words [overflow-wrap:anywhere]">
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

        <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-red-50/80 border border-red-200 text-red-900 shadow-xs break-words [overflow-wrap:anywhere]">
          <p className="text-sm leading-relaxed">{message.content}</p>

          {onRetry && (
            <button
              type="button"
              onClick={() => onRetry(message.rawInput)}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-all shadow-xs active:scale-95"
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
    <div className="flex items-start gap-3 max-w-[94%] sm:max-w-[88%] animate-fadeIn overflow-hidden">
      {/* Bot Avatar with real Alice portrait */}
      <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-200/80 shadow-xs shrink-0 mt-0.5">
        <Image
          src="/images/alice.jpg"
          alt="Alice"
          width={36}
          height={36}
          className="w-full h-full object-cover object-top"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Medical disclaimer note if triggered and not yet shown this session */}
        {message.show_disclaimer && !hasShownDisclaimer && (
          <DisclaimerNote
            onDismiss={() => {
              onDisclaimerShown?.();
            }}
          />
        )}

        <div
          className={`px-4 py-3.5 rounded-2xl rounded-tl-sm shadow-xs text-slate-800 break-words [overflow-wrap:anywhere] overflow-x-hidden max-w-full ${
            isCannotAnswer
              ? "bg-[#FFF9F3] border border-[#F3E7D8]"
              : "bg-[#FFFBF7] border border-[#F3E7D8]"
          }`}
        >
          {isCannotAnswer && (
            <div className="flex items-center gap-2 text-xs font-bold text-ink-muted mb-2.5 pb-2 border-b border-outline/50">
              <Info className="w-4 h-4 text-coral" />
              <span>Verified Information Boundary</span>
            </div>
          )}

          <div className="prose prose-sm sm:prose-base max-w-none text-slate-800 leading-relaxed break-words [overflow-wrap:anywhere] overflow-x-hidden">
            <ReactMarkdown
              rehypePlugins={[rehypeSanitize]}
              components={components}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Source attribution badges */}
          <SourceChips sources={message.sources} />

          {/* Lead form card if user asked for booking/consultation */}
          {message.show_lead_form && <LeadForm sessionId={sessionId} />}
        </div>

        <span className="text-[11px] text-ink-muted ml-1 mt-1 font-mono">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
