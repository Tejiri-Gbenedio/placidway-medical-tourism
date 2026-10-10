export interface ChatRequest {
  sessionId: string;
  message: string;
  channel: "web";
}

export interface Source {
  title: string;
  url: string;
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
  can_answer: boolean;
  show_quote_cta: boolean;
  show_lead_form: boolean;
  show_disclaimer: boolean;
  language: string;
  suggested_followups?: string[];
}

export interface LeadRequest {
  sessionId: string;
  name: string;
  email: string;
  consent: true;
}

export interface LeadResponse {
  ok: true;
}

export interface SourceItem {
  title: string;
  url: string;
  page_type: string;
  last_refreshed: string | null;
}

export interface SourcesResponse {
  last_refreshed: string | null;
  sources: SourceItem[];
}

export type ApiErrorCode =
  | "invalid_input"
  | "rate_limited"
  | "upstream_timeout"
  | "upstream_error";

export interface ApiError {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}

export interface HealthResponse {
  status: "ok";
  mode: "mock" | "live";
  upstream_configured: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: Source[];
  can_answer?: boolean;
  show_quote_cta?: boolean;
  show_lead_form?: boolean;
  show_disclaimer?: boolean;
  suggested_followups?: string[];
  isError?: boolean;
  rawInput?: string;
}
