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

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
      setTimeout(() => textareaRef.current?.focus(), 150);
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
      {/* Floating launcher trigger (bottom right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div
            onClick={onToggle}
            className="hidden sm:flex items-center gap-2.5 bg-white text-ink px-4 py-2.5 rounded-full shadow-card border border-outline cursor-pointer hover:border-coral transition-all active:scale-95 animate-fadeIn"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-status-green" />
            <div className="text-sm">
              <span className="font-bold text-ink">Need assistance? </span>
              <span className="text-ink-muted">Chat with Alice</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onToggle}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-floating transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/30 ${
            isOpen
              ? "bg-ink text-white rotate-90"
              : "bg-coral hover:bg-coral-hover text-white hover:scale-105"
          }`}
          aria-label={isOpen ? "Close chatbot" : "Open Alice medical assistant"}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-status-green border-2 border-white" />
            </div>
          )}
        </button>
      </div>

      {/* Floating widget window */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-20 sm:inset-auto sm:bottom-24 sm:right-6 w-auto sm:w-[460px] md:w-[490px] h-[660px] max-h-[85vh] bg-surface rounded-2xl shadow-floating border border-outline flex flex-col z-50 overflow-hidden animate-fadeIn">
          {/* Header Bar */}
          <div className="bg-[#1E2E48] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-peach-100 flex items-center justify-center overflow-hidden border-2 border-coral">
                  <Image
                    src="/logo.svg"
                    alt="Alice Avatar"
                    width={26}
                    height={26}
                    className="w-6 h-6"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-status-green border-2 border-[#1E2E48]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base tracking-tight text-white">Alice</h3>
                  <span className="text-xs bg-coral text-white font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Virtual Assistant
                  </span>
                </div>
                <p className="text-xs text-white/80 leading-tight mt-0.5">
                  PlacidWay Medical Tourism Specialist
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onNewChat}
                className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Restart conversation"
                aria-label="New chat session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Minimize chat window"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-header status bar */}
          <div className="bg-peach-50 px-4 py-2.5 border-b border-outline flex items-center justify-between text-xs text-ink-muted shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-green" />
              <span className="font-medium">Immunity Therapy Center Knowledge Base</span>
            </div>

            <span className="font-mono text-xs bg-surface px-2.5 py-0.5 rounded-full border border-outline font-semibold">
              {mode === "live" ? "Live n8n" : "Verified Mock Engine"}
            </span>
          </div>

          {/* Messages Stream with comfortable font sizes */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-page/40"
          >
            {messages.length === 0 && (
              <div className="py-4 space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-peach-100 border border-coral-border flex items-center justify-center mx-auto text-coral shadow-soft">
                  <MessageSquare className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="font-bold text-ink text-base">
                    PlacidWay Knowledge Assistant
                  </h4>
                  <p className="text-sm text-ink-muted mt-1.5 max-w-sm mx-auto leading-relaxed">
                    I answer questions regarding cancer treatment programs, package inclusions, and official pricing for <strong>Immunity Therapy Center (ITC) in Tijuana, Mexico</strong>.
                  </p>
                </div>

                <div className="text-left space-y-2 pt-2">
                  <span className="text-xs font-bold text-ink-muted uppercase tracking-wider block px-1">
                    Suggested Questions:
                  </span>
                  {DEFAULT_SUGGESTIONS.slice(0, 4).map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onSendMessage(suggestion)}
                      className="w-full text-left p-3 rounded-xl bg-surface hover:bg-peach-100 hover:text-coral border border-outline text-xs sm:text-sm font-medium text-ink transition-all shadow-xs flex items-center justify-between group active:scale-98"
                    >
                      <span className="line-clamp-1">{suggestion}</span>
                      <span className="text-coral opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 font-bold">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                sessionId={sessionId}
                hasShownDisclaimer={hasShownDisclaimer}
                onDisclaimerShown={() => setHasShownDisclaimer(true)}
                onFollowupClick={onSendMessage}
                onRetry={onRetry}
              />
            ))}

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
