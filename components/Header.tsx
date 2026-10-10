"use client";

import Image from "next/image";
import { RotateCcw, Sparkles } from "lucide-react";
import { APP_NAME } from "@/config/brand";

interface HeaderProps {
  mode: "mock" | "live";
  onNewChat: () => void;
  disabled?: boolean;
}

export function Header({ mode, onNewChat, disabled }: HeaderProps) {
  return (
    <header className="w-full bg-surface/90 backdrop-blur-md border-b border-outline sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-coral flex items-center justify-center shadow-soft">
            <Image
              src="/logo.svg"
              alt={`${APP_NAME} logo`}
              width={24}
              height={24}
              className="w-6 h-6"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink text-base tracking-tight">
                {APP_NAME}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-peach-100 text-coral border border-coral-border">
                Demo
              </span>
            </div>
            <span className="text-xs text-ink-muted hidden sm:inline">
              Immunity Therapy Center Knowledge Base
            </span>
          </div>
        </div>

        {/* Status indicator & actions */}
        <div className="flex items-center gap-3">
          {/* Mode Badge */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              mode === "live"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
            title={
              mode === "live"
                ? "Connected to live n8n AI webhook backend"
                : "Running in local mock mode (grounded in 7 ITC source pages)"
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                mode === "live" ? "bg-green-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span>{mode === "live" ? "Live n8n Mode" : "Mock Mode (7 Sources)"}</span>
          </div>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={onNewChat}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold text-ink bg-page hover:bg-peach-100 active:scale-95 border border-outline transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            aria-label="Start a new chat session"
          >
            <RotateCcw className="w-3.5 h-3.5 text-coral" />
            <span>New chat</span>
          </button>
        </div>
      </div>
    </header>
  );
}
