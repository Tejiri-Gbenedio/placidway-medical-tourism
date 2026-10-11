"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  ArrowDown,
  ShieldAlert,
  ChevronDown,
  Volume2,
  Calendar,
} from "lucide-react";
import { Message, ChatResponse, ApiError } from "@/lib/types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { DEFAULT_SUGGESTIONS } from "./SuggestedQuestions";

interface FloatingChatbotProps {
  sessionId: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  messages: Message[];
  loading: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onRetry: (rawInput?: string) => Promise<void>;
  onNewChat: () => void;
  mode: "mock" | "live";
}

export function FloatingChatbot({
  sessionId,
  isOpen,
  onToggle,
  onClose,
  messages,
  loading,
  onSendMessage,
  onRetry,
  onNewChat,
  mode,
}: FloatingChatbotProps) {
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
      const nextHeight = Math.min(textareaRef.current.scrollHeight, 110);
      textareaRef.current.style.height = `${nextHeight}px`;
    }
  }, [input]);

  const lastAssistantMessageRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 60;
    setShowScrollBottom(!isAtBottom);
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Focus textarea when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Smart scrolling on new messages and loading changes
  useEffect(() => {
    if (!isOpen) return;

    if (loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === "assistant") {
      // Scroll smoothly to the top of Alice's response so the user reads from the beginning!
      setTimeout(() => {
        lastAssistantMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, loading]);

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

  return (
    <>
      {/* Floating launcher trigger matching screenshot */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={onToggle}
          className={`px-4 py-2.5 rounded-full flex items-center justify-center gap-2.5 shadow-floating transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/30 ${
            isOpen
              ? "bg-[#1E2E48] text-white"
              : "bg-[#182B49] hover:bg-[#0E1A2C] text-white border border-white/10"
          }`}
          aria-label={isOpen ? "Close chatbot" : "Open Alice medical assistant"}
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5" />
              <span className="text-sm font-bold">Close</span>
            </>
          ) : (
            <>
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20">
                <Image
                  src="/images/alice.jpg"
                  alt="Alice"
                  width={28}
                  height={28}
                  className="w-full h-full object-cover object-top"
                />
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white absolute bottom-0 right-0" />
              </div>
              <span className="text-sm font-semibold pr-1">Chat with Alice</span>
            </>
          )}
        </button>
      </div>

      {/* Floating widget window matching reference image */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-20 sm:inset-auto sm:bottom-24 sm:right-6 w-auto sm:w-[440px] md:w-[460px] h-[640px] max-h-[85vh] bg-[#FCF9F5] rounded-[28px] shadow-floating border border-[#F0E4D5] flex flex-col z-50 overflow-hidden animate-fadeIn">
          {/* Header Bar matching reference image */}
          <div className="bg-[#FDF6ED] p-4 sm:p-5 border-b border-[#F4E6D5] shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-200/90 shadow-xs">
                    <Image
                      src="/images/alice.jpg"
                      alt="Alice Avatar"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#FDF6ED]" />
                </div>

                <div>
                  <h3 className="font-bold text-[18px] text-slate-900 leading-tight tracking-tight">
                    Alice
                  </h3>
                  <p className="text-[12px] text-slate-500 font-medium leading-tight mt-0.5">
                    PlacidWay Virtual Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onNewChat}
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors flex items-center justify-center"
                  title="Restart conversation"
                  aria-label="New chat session"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white shadow-xs border border-stone-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all active:scale-95"
                  aria-label="Close chat window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Pill Switcher Bar */}
            <div className="bg-white p-1 rounded-full shadow-xs border border-stone-200/80 flex items-center justify-between text-xs font-semibold mt-3.5">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full border border-coral text-coral bg-coral/5 font-semibold transition-all shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-coral" />
                <span>Chat</span>
              </button>
              <button
                type="button"
                onClick={() => onSendMessage("I would like to speak directly with an ITC coordinator.")}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Talk Now</span>
              </button>
            </div>
          </div>

          {/* Messages Stream with zero horizontal overflow */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-4 bg-[#FCF9F5] max-w-full"
          >
            {messages.length === 0 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-200/80 shadow-xs shrink-0 mt-0.5">
                    <Image
                      src="/images/alice.jpg"
                      alt="Alice"
                      width={36}
                      height={36}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 px-4 py-3.5 rounded-2xl rounded-tl-sm bg-[#FFFBF7] border border-[#F3E7D8] shadow-xs text-slate-800 text-[14px] leading-relaxed space-y-2.5">
                    <p>
                      Hi, this is Alice 😊, your PlacidWay Virtual Assistant.
                    </p>
                    <p className="text-slate-600">
                      Thanks for visiting PlacidWay. I can answer questions about Immunity Therapy Center (ITC) in Tijuana, including prices, packages, and care options.
                    </p>
                  </div>
                </div>

                <div className="pt-2 pl-12 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Suggested Questions:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {DEFAULT_SUGGESTIONS.slice(0, 3).map((suggestion, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => onSendMessage(suggestion)}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-peach-100 hover:text-coral border border-stone-200/80 text-xs font-medium text-slate-700 transition-all shadow-xs flex items-center justify-between group active:scale-98"
                      >
                        <span className="line-clamp-1">{suggestion}</span>
                        <span className="text-coral opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 font-bold">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
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
                    onFollowupClick={onSendMessage}
                    onRetry={onRetry}
                  />
                </div>
              );
            })}

            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Scroll Bottom Button */}
          {showScrollBottom && (
            <button
              type="button"
              onClick={() => scrollToBottom(true)}
              className="absolute bottom-24 right-6 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-coral text-white text-xs font-semibold shadow-floating hover:bg-coral-hover active:scale-95 transition-all"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>New messages</span>
            </button>
          )}

          {/* Chat Composer with larger input font */}
          <div className="p-3.5 bg-surface border-t border-outline shrink-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex items-end gap-2.5 bg-page rounded-xl border border-outline focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20 p-2 transition-all">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Alice about ITC treatments, prices, or care..."
                  disabled={loading}
                  maxLength={1000}
                  className="w-full resize-none max-h-28 bg-transparent text-ink placeholder:text-ink-muted text-sm sm:text-base px-2 py-1 focus:outline-none leading-relaxed disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl bg-coral hover:bg-coral-hover text-white flex items-center justify-center shrink-0 shadow-soft transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between px-1 text-xs text-ink-muted">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-coral shrink-0" />
                  <span>Confidential. Do not share personal medical records.</span>
                </div>
                {input.length >= 800 && (
                  <span className="font-mono text-coral font-bold">{input.length}/1000</span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
