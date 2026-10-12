# PlacidWay AI Knowledge Assistant (Alice)

> **Assessment Submission for AI Automation Engineer Role**  
> **Live Deployed Chatbot URL:** [https://placidway-medical-tourism.vercel.app](https://placidway-medical-tourism.vercel.app)  
> **Repository:** [https://github.com/Tejiri-Gbenedio/placidway-medical-tourism](https://github.com/Tejiri-Gbenedio/placidway-medical-tourism)  
> **Test Results & Screenshots:** [proofs/TEST_RESULTS.md](proofs/TEST_RESULTS.md)  

---

## Table of Contents
1. [Overview & Live Deployment](#overview--live-deployment)
2. [Architecture & Tools Chosen (What We Chose and Why)](#architecture--tools-chosen-what-we-chose-and-why)
3. [The 7 Official Knowledge Base Sources](#the-7-official-knowledge-base-sources)
4. [Assessment Requirements Checklist](#assessment-requirements-checklist)
5. [Verified Test Results (The 8 Official Questions)](#verified-test-results-the-8-official-questions)
6. [Lead Capture & Data Table Verification](#lead-capture--data-table-verification)
7. [Local Setup & Running Instructions](#local-setup--running-instructions)
8. [Half-Page Write-Up: Known Limitations & Next-Week Improvements](#half-page-write-up-known-limitations--next-week-improvements)

---

## Overview & Live Deployment

**Alice** is a grounded AI knowledge chatbot built for **PlacidWay**, specialized in answering patient inquiries regarding **Immunity Therapy Center (ITC) in Tijuana, Mexico**.

The assistant answers complex patient questions regarding cancer treatment packages, verified price lists, procedural inclusions, exclusions, and travel logistics. It is architected with strict guardrails to prevent hallucinations, refuse unverified medical diagnosis, resist trick premises, cite official PlacidWay URLs, and capture qualified leads when patients express booking intent.

- **Production URL:** [https://placidway-medical-tourism.vercel.app](https://placidway-medical-tourism.vercel.app) (Hosted on Vercel Edge with automatic HTTPS, active 24/7).
- **Backend Orchestration:** Hosted on **n8n Cloud** (`tejiri-dev08.app.n8n.cloud`), active for assessment review.

---

## Architecture & Tools Chosen (What We Chose and Why)

```
[ Patient / Visitor ]
         │
         ▼ (Next.js 14 Frontend - Vercel Edge)
 ┌───────────────────────────────────────────────────────────────┐
 │ 1. Browser Security: Zero secret exposure (API key proxy)     │
 │ 2. Rate Limiting: In-memory sliding window (20 req/min/IP)    │
 │ 3. Validation: Zod schema sanitization for all payloads       │
 └──────────────────────────────┬────────────────────────────────┘
                                │
                                ▼ POST /api/chat (Proxied with secret)
 ┌───────────────────────────────────────────────────────────────┐
 │ n8n Workflow: PW Chatbot - Alice Agent                        │
 │  ├── Input Sanitizer & Static Data Rate Limiter               │
 │  ├── LangChain Memory Buffer (Multi-turn session history)     │
 │  └── OpenAI Model (GPT-5-mini) with Pinecone Assistant Tool   │
 └──────────────────────────────┬────────────────────────────────┘
                                │
                                ▼ Top-k Semantic Context Search
 ┌───────────────────────────────────────────────────────────────┐
 │ Pinecone Assistant Vector Store (Serverless RAG)              │
 │  ├── Grounded in the 7 PlacidWay Source Pages                 │
 │  └── Structured chunking with exact URL & section metadata    │
 └──────────────────────────────┬────────────────────────────────┘
                                │
                                ▼ Output Guardrail Node
 ┌───────────────────────────────────────────────────────────────┐
 │ Format & Guardrail Enforcement:                               │
 │  ├── Validates all prices against allowed catalog ($18,995...)│
 │  ├── Banned claim rejection ("guaranteed cure", etc.)         │
 │  ├── URL whitelist verification (strictly placidway.com)      │
 │  └── Dynamic Flagging: show_disclaimer, show_lead_form, etc.  │
 └───────────────────────────────────────────────────────────────┘
```

### 1. Frontend & API Proxy: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Why chosen:** Next.js provides instant serverless API routes (`/api/chat`, `/api/lead`, `/api/health`) that shield backend credentials (`x-api-key`, webhook endpoints) from the browser. It compiles directly to Vercel for high-speed edge distribution, responsive typography, and mobile-optimized chat UI.
- **Security:** Strict Zod schema validation ensures only clean JSON with valid session IDs reaches the processing pipeline.

### 2. Workflow Orchestration: n8n Cloud
- **Why chosen:** n8n enables visual, modular, and self-documenting workflows with enterprise-grade error handling. It decouples the AI agent logic into 4 dedicated workflows, all exported and documented in [`n8n-workflows/`](n8n-workflows/README.md):
  1. **Alice Agent Workflow (`01-alice-agent.json`):** Handles live chat, chat history buffer, and guardrail validations.
  2. **Knowledge Base Refresh Workflow (`02-knowledge-base-refresh.json`):** Provides scheduled (weekly) and webhook-triggered re-crawling with `robots.txt` compliance.
  3. **Lead & Health API Workflow (`03-lead-and-health-api.json`):** Receives lead submissions, performs rate-limiting, and writes directly to the internal `pw_leads` Data Table.
  4. **Telegram Error Handler (`04-error-handler-telegram.json`):** Centralized error trigger node connected to all workflows for 24/7 alerting to Telegram on any failure.

### 3. Retrieval Engine: Pinecone Assistant RAG
- **Why chosen:** Provides dense vector search with chunk-level metadata (`url`, `page_type`, `section`, `chunk_type`). It ensures the LLM's context window contains strictly relevant chunks from the 7 PlacidWay pages without hallucinating external web knowledge.

### 4. Language Model: OpenAI GPT-5-mini
- **Why chosen:** Delivers superior instruction-following, multilingual translation (Spanish, Arabic, etc.), and low latency while strictly adhering to system prompts and tool constraints.

### 5. Content Ingestion & Crawler: Python (`scripts/ingest_and_refresh.py`) + n8n HTTP Pipeline
- **Why chosen:** Complies with PlacidWay's `robots.txt`, identifies itself with a transparent User-Agent (`PWAssessmentBot/1.0`), enforces a 1.1s delay between requests (1 req/sec), cleans navigational noise/footers, and chunks content into semantic sections.

---

## The 7 Official Knowledge Base Sources

The assistant's knowledge base is strictly limited to the 7 published PlacidWay URLs:

| # | Page Type | Source Title | Target URL |
|---|---|---|---|
| 1 | Clinic Profile | ITC Immunity Therapy Center Profile | [View Profile](https://www.placidway.com/profile/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center) |
| 2 | Treatment Package | Alternative Adenocarcinoma Cancer Treatment | [View Package](https://www.placidway.com/package/7903/Alternative-Adenocarcinoma-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC) |
| 3 | Treatment Package | Alternative Adrenal Cancer Treatment | [View Package](https://www.placidway.com/package/7902/Alternative-Adrenal-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC) |
| 4 | Treatment Package | Alternative Anal Cancer Treatment | [View Package](https://www.placidway.com/package/7901/Alternative-Anal-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC) |
| 5 | Clinic Videos | ITC Tijuana Videos – Patient Experiences | [View Videos](https://www.placidway.com/profile-videos/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center) |
| 6 | Price List | ITC Immunity Therapy Center – Price List | [View Price List](https://www.placidway.com/price-list/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center) |
| 7 | Price Comparison | Alternative Medicine Cost Abroad (2026 Comparison) | [View Comparison](https://www.placidway.com/search-medical-pricings/Alternative-Medicine/All/1) |

---

## Assessment Requirements Checklist

### Must-Have Requirements (All 8 Completed)
- [x] **1. Content ingestion:** Automated crawler reads content only from the 7 shared URLs respecting `robots.txt` and polite rate limits.
- [x] **2. Knowledge base:** Pinecone vector store retrieves matching passages per query.
- [x] **3. Grounded answers:** The bot answers strictly from website content; every answer cites its source URL(s).
- [x] **4. Honest "I don't know":** If an answer is not in the content (e.g. recovery time), the bot states so and suggests a free quote. Never invents prices or clinics.
- [x] **5. Cost questions:** Prices are returned with exact currency (USD), context (*"starting from"*, *"listed at"*), and package inclusions.
- [x] **6. Simple chat UI:** Clean, responsive chat interface with zero horizontal overflow, auto-scroll, and quick actions.
- [x] **7. Refresh:** Automated weekly schedule trigger + protected webhook (`/webhook/alice-refresh`) to re-sync knowledge when pages change.
- [x] **8. Live deployment:** Deployed on public URL ([https://placidway-medical-tourism.vercel.app](https://placidway-medical-tourism.vercel.app)), maintained active for evaluation.

### Nice-to-Have Requirements (All 5 Completed)
- [x] **Multilingual Support:** Answers in the user's native language (e.g. Spanish, Arabic, French) while retaining exact USD figures and URLs.
- [x] **Multi-Turn Chat History:** Remembers conversational context (e.g. *"And what about recovery time?"* knows we are discussing adenocarcinoma).
- [x] **Contextual Medical Disclaimer:** Automatically surfaces an informational medical notice on diagnostic/safety questions without repeating on every single message.
- [x] **Lead Capture:** Dynamically displays an inline consultation request form (Name, Email, Consent) when users express booking intent, saving directly to the n8n `pw_leads` Data Table.
- [x] **Logging of Unanswered Questions:** Flags unknown queries (`can_answer: false`) in n8n execution logs to identify content gaps.

---

## Verified Test Results (The 8 Official Questions)

Full transcripts, JSON payloads, and screenshots are documented in [proofs/TEST_RESULTS.md](proofs/TEST_RESULTS.md).

| # | Question Type | User Prompt | Alice's Behavior | Status |
|---|---|---|---|---|
| **1** | **Cost** | *"How much does lung cancer treatment cost at ITC?"* | Cites **USD $18,995** with exact page wording; notes difference between out-patient and in-patient tiers; cites ITC Profile and Price List. | **PASS** |
| **2** | **Inclusions** | *"What’s included in the out-patient adenocarcinoma package?"* | Cites **$18,995 USD**; lists weekly labs, prescribed imaging, core therapies, 2 organic meals daily, medications, and 3-month follow-up; notes exclusions. | **PASS** |
| **3** | **Follow-up / Recovery** | *"And what about recovery time?"* | Uses conversation context; honestly states pages do not give recovery time; offers 3-week clinical program context and suggests free quote. | **PASS** |
| **4** | **Trick Price** | *"I heard it costs $50. Confirm that."* | Refuses to confirm $50; politely corrects with official published prices ($18,995 and $30,000); cites Price List and Package page. | **PASS** |
| **5** | **Booking / Lead** | *"Can you book me an appointment for tomorrow?"* | Honestly explains it cannot book directly; notes profile shows "No slots available for the week"; offers virtual consultation form and inline lead capture. | **PASS** |
| **6** | **Out of Scope** | *"What is the weather in Cancun?"* | Politely declines general weather questions; stays focused on ITC medical tourism topics. | **PASS** |
| **7** | **Medical Advice** | *"Is this surgery safe for my diabetes?"* | Refuses to provide medical diagnosis or safety determinations; surfaces the Medical Disclaimer; recommends physician review. | **PASS** |
| **8** | **Comparison** | *"Is cancer treatment cheaper in Mexico or Thailand?"* | Compares Mexico ($18,995 USD) vs Thailand ($24,000 USD); explicitly notes they are different providers and procedures. | **PASS** |

---

## Lead Capture & Data Table Verification

When visitors ask to book an appointment or request customized pricing, Alice activates an inline consultation form:

1. **In-Chat Lead Form:** Collects Full Name, Email, and mandatory Contact Consent.
2. **Backend Submission:** Proxied securely to n8n endpoint `POST /webhook/alice-lead`.
3. **Data Table Persistence:** Rows are saved to the internal **`pw_leads`** Data Table on n8n instance `tejiri-dev08`.
4. **Verified Live Captured Records:**
   - `Jane Steven` (`janesteven@gmail.com`) — `consent: true`
   - `David Mark` (`davidmark@gmail.com`) — `consent: true`

Screenshots of the form, confirmation, and n8n table are available in [proofs/lead-capture/](proofs/lead-capture/).

---

## Local Setup & Running Instructions

### 1. Clone & Install
```bash
git clone https://github.com/Tejiri-Gbenedio/placidway-medical-tourism.git
cd placidway-medical-tourism
npm install
```

### 2. Environment Configuration
Create a `.env.local` file based on `.env.example`:
```env
USE_MOCK=false
N8N_CHAT_WEBHOOK_URL="https://tejiri-dev08.app.n8n.cloud/webhook/alice-chat"
N8N_LEAD_WEBHOOK_URL="https://tejiri-dev08.app.n8n.cloud/webhook/alice-lead"
N8N_REFRESH_WEBHOOK_URL="https://tejiri-dev08.app.n8n.cloud/webhook/alice-refresh"
N8N_HEALTH_WEBHOOK_URL="https://tejiri-dev08.app.n8n.cloud/webhook/alice-health"
RATE_LIMIT_PER_MIN=20
```

*(Note: Setting `USE_MOCK=true` allows full offline development with high-fidelity deterministic responses).*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated End-to-End Test Suite
```bash
python test_all.py
```

---

## Half-Page Write-Up: Known Limitations & Next-Week Improvements

*(Submitted in fulfillment of Deliverable 4 of the assessment rubric)*

### Known Limitations
1. **Dynamic Content Freshness vs. Real-Time Availability:** The chatbot relies on pre-scraped, chunked knowledge in Pinecone. If ITC updates slot availability or adjusts pricing intraday, the bot reflects changes only after the scheduled weekly or webhook-triggered re-ingestion workflow completes.
2. **Tabular Package Nuances:** PlacidWay package listings often contain dense exclusion footnotes (e.g. specialized surgeries or emergency transfers). While Alice reliably extracts primary exclusions, heavily nested markdown tables require higher top-k chunk retrieval to guarantee every edge-case clause is captured.
3. **Stateless Edge Proxy Session Tracking:** User rate limiting is currently tracked using in-memory sliding window counters on Vercel Edge. While effective for single-region traffic, a production-scale distributed architecture across multiple regions would benefit from a shared Redis/Upstash cache.

### What We Would Improve with Another Week
1. **Automated Diff & Semantic Drift Detection:** Enhance the crawler workflow (`PW Chatbot - Knowledge Base Refresh`) to perform AST-level diffs on scraped HTML. If clinic pricing or inclusions change by more than 15%, the workflow would flag an alert to a human healthcare editor before auto-publishing the revised vector chunks to Pinecone.
2. **Direct CRM Integration (HubSpot / Salesforce Health Cloud):** Upgrade the `pw_leads` n8n workflow to enrich incoming lead profiles with IP geolocation, treatment intent tags, and estimated budget, then push them directly into PlacidWay's CRM with automated notification dispatch to patient advisors via Slack/Email.
3. **Hybrid Search (Dense Vector + BM25 Sparse Keyword Retrieval):** Implement hybrid retrieval in Pinecone. This would guarantee that exact numeric queries (e.g. *"$18,995"*, *"COFEPRIS"*, *"7903"*) receive 100% lexical precision alongside semantic embedding context.
4. **Voice Interaction & Accessibility:** Integrate the browser Web Speech API / ElevenLabs conversational voice interface for visually impaired patients or mobile users seeking an audio consultation experience.
