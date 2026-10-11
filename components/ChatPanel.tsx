"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, ArrowDown, ShieldAlert, Sparkles } from "lucide-react";
import { Message, ChatResponse, ApiError } from "@/lib/types";
import { APP_NAME } from "@/config/brand";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface ChatPanelProps {
  sessionId: string;
  messages: Message[];
  loading: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onRetry: (rawInput?: string) => Promise<void>;
  onFollowupClick: (text: string) => void;
  mode: "mock" | "live";
}

export function ChatPanel({
  sessionId,
  messages,
  loading,
  onSendMessage,
  onRetry,
  onFollowupClick,
  mode,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [hasShownDisclaimer, setHasShownDisclaimer] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const nextHeight = Math.min(textareaRef.current.scrollHeight, 130);
      textareaRef.current.style.height = `${nextHeight}px`;
    }
  }, [input]);

  // Handle scroll detection
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 80;
    setShowScrollBottom(!isAtBottom);
  };

  const lastAssistantMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    if (loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === "assistant") {
      setTimeout(() => {
        lastAssistantMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const query = input.trim();
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    onSendMessage(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const charCount = input.length;
  const isNearLimit = charCount >= 800;

  return (
    <div className="flex flex-col h-[700px] max-h-[85vh] rounded-card bg-surface border border-outline shadow-card overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3.5 bg-page border-b border-outline flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-peach-100 border border-coral-border flex items-center justify-center shadow-xs">
              <Image
                src="/logo.svg"
                alt="Avatar"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </div>
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-status-green ring-2 ring-white"
              title="Assistant Online"
            />
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold text-ink leading-tight flex items-center gap-1.5">
              <span>{APP_NAME}</span>
              <span className="text-[10px] font-medium text-coral bg-peach-100 px-2 py-0.5 rounded-full border border-coral-border">
                ITC Tijuana Specialist
              </span>
            </h3>
            <p className="text-[11px] text-ink-muted leading-tight mt-0.5">
              Answers verified from 7 official PlacidWay pages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface border border-outline text-ink-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-status-green" />
            <span className="capitalize">{mode} Mode</span>
          </span>
        </div>
      </div>

      {/* Message stream */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 relative scroll-smooth"
      >
        {/* Empty state welcome message */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 max-w-md mx-auto space-y-4 my-auto animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-peach-100 border border-coral-border flex items-center justify-center shadow-soft">
              <Sparkles className="w-7 h-7 text-coral" />
            </div>

            <div>
              <h4 className="text-base font-bold text-ink tracking-tight">
                Welcome to Clarity Assistant
              </h4>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                I am your specialized assistant for <strong>Immunity Therapy Center</strong> in Tijuana, Mexico. Ask me about cancer treatments, published pricing, 3-week package inclusions, or request a free quote.
              </p>
            </div>

            <div className="text-xs bg-page p-3.5 rounded-xl border border-outline text-ink-muted leading-relaxed">
              💡 <em>Tip: Pick any question from the side panel or type your own below. Every answer includes direct source citations to official PlacidWay listings.</em>
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          const isLastAssistant =
            msg.role === "assistant" &&
            index === messages.map((m) => m.role).lastIndexOf("assistant");

          return (
            <div
              key={msg.id}
              ref={isLastAssistant ? lastAssistantMessageRef : null}
              className="scroll-mt-3"
            >
              <MessageBubble
                message={msg}
                sessionId={sessionId}
                hasShownDisclaimer={hasShownDisclaimer}
                onDisclaimerShown={() => setHasShownDisclaimer(true)}
                onFollowupClick={onFollowupClick}
                onRetry={onRetry}
              />
            </div>
          );
        })}

        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom floating pill */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-24 right-8 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-coral text-white text-xs font-semibold shadow-floating hover:bg-coral-hover active:scale-95 transition-all animate-bounce"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>New messages</span>
        </button>
      )}

      {/* Composer */}
      <div className="p-3 sm:p-4 bg-page border-t border-outline shrink-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="relative flex items-end gap-2 bg-surface rounded-2xl border border-outline focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20 transition-all p-1.5 shadow-xs">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about treatments, pricing, or package inclusions..."
              disabled={loading}
              maxLength={1000}
              className="w-full resize-none max-h-32 bg-transparent text-ink placeholder:text-ink-light text-xs sm:text-sm px-3 py-2 focus:outline-none leading-relaxed disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-coral hover:bg-coral-hover text-white flex items-center justify-center shrink-0 shadow-soft transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-ink-muted">
            <div className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-coral shrink-0" />
              <span>Please don't share personal medical details.</span>
            </div>

            {isNearLimit && (
              <span className="font-mono text-coral font-medium">
                {charCount} / 1000
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
