import { z } from "zod";

export const SourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
});

export const ChatRequestSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message cannot exceed 1,000 characters"),
  channel: z.literal("web"),
});

export const ChatResponseSchema = z.object({
  answer: z.string(),
  sources: z.array(SourceSchema).default([]),
  can_answer: z.boolean().default(true),
  show_quote_cta: z.boolean().default(false),
  show_lead_form: z.boolean().default(false),
  show_disclaimer: z.boolean().default(false),
  language: z.string().default("en"),
  suggested_followups: z.array(z.string()).max(3).optional(),
});

export const LeadRequestSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must consent to be contacted" }),
  }),
});

export const LeadResponseSchema = z.object({
  ok: z.literal(true),
});

/**
 * Defense-in-depth URL sanitizer
 * Ensures cited source links strictly belong to placidway.com
 */
export function sanitizeSources(sources: Array<{ title: string; url: string }>) {
  return sources.filter((s) => {
    try {
      const parsed = new URL(s.url);
      return (
        parsed.hostname === "www.placidway.com" ||
        parsed.hostname === "placidway.com"
      );
    } catch {
      return false;
    }
  });
}
