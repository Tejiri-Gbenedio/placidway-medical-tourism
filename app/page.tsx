"use client";

import { useState, useEffect, useRef } from "react";
import { PlacidWayHeader } from "@/components/PlacidWayHeader";
import { PlacidWayHero } from "@/components/PlacidWayHero";
import { TreatmentsSection } from "@/components/TreatmentsSection";
import { ClinicSpotlight } from "@/components/ClinicSpotlight";
import { DestinationsSection } from "@/components/DestinationsSection";
import { TrustSection } from "@/components/TrustSection";
import { Footer } from "@/components/Footer";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { Message, ChatResponse, ApiError } from "@/lib/types";
import { getOrCreateSessionId, resetSessionId } from "@/lib/session";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"mock" | "live">("mock");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize session and fetch health status
  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);

    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.mode === "live" || data.mode === "mock") {
          setMode(data.mode);
        }
      })
      .catch(() => setMode("mock"));
  }, []);

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    // Ensure chat is open when message is sent
    setIsChatOpen(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: formatTimestamp(),
      rawInput: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: text,
          channel: "web",
        }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        const errorData = data as ApiError;
        throw new Error(
          errorData.error?.message || "Failed to retrieve an answer"
        );
      }

      const chatResp = data as ChatResponse;

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: chatResp.answer,
        timestamp: formatTimestamp(),
        sources: chatResp.sources,
        can_answer: chatResp.can_answer,
        show_quote_cta: chatResp.show_quote_cta,
        show_lead_form: chatResp.show_lead_form,
        show_disclaimer: chatResp.show_disclaimer,
        suggested_followups: chatResp.suggested_followups,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          err instanceof Error
            ? err.message
            : "An unexpected network error occurred. Please click Retry.",
        timestamp: formatTimestamp(),
        isError: true,
        rawInput: text,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (rawInput?: string) => {
    if (!rawInput) return;
    setMessages((prev) => prev.filter((m) => !m.isError));
    await handleSendMessage(rawInput);
  };

  const handleNewChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const freshId = resetSessionId();
    setSessionId(freshId);
    setMessages([]);
    setLoading(false);
  };

  const handleOpenChatWithQuery = (prompt?: string) => {
    setIsChatOpen(true);
    if (prompt) {
      handleSendMessage(prompt);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-page text-ink selection:bg-peach-200 selection:text-ink">
      {/* PlacidWay Header with Top Assessment Ribbon */}
      <PlacidWayHeader
        onOpenChat={() => setIsChatOpen(true)}
        mode={mode}
      />

      <main className="flex-1 w-full">
        {/* PlacidWay Hero with Dual Search Bar & AI Assistant Button */}
        <PlacidWayHero
          onOpenChatWithQuery={handleOpenChatWithQuery}
        />

        {/* Featured Clinic Spotlight: Immunity Therapy Center (Assessment Core) */}
        <ClinicSpotlight
          onAskAboutITC={handleOpenChatWithQuery}
        />

        {/* Popular Medical Treatments Grid with AI Trigger Badges */}
        <TreatmentsSection
          onAskTreatment={handleOpenChatWithQuery}
        />

        {/* Top Medical Destinations (Mexico, Turkey, Thailand, Costa Rica) */}
        <DestinationsSection
          onSelectDestination={handleOpenChatWithQuery}
        />

        {/* Trust & Savings Table (US vs Partner Clinics) */}
        <TrustSection />
      </main>

      {/* Footer with Assessment Notice & Contact */}
      <Footer />

      {/* Interactive Floating Chatbot Widget (Alice) */}
      <FloatingChatbot
        sessionId={sessionId}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        loading={loading}
        onSendMessage={handleSendMessage}
        onRetry={handleRetry}
        onNewChat={handleNewChat}
        mode={mode}
      />
    </div>
  );
}
