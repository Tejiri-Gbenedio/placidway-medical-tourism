# PlacidWay AI Chatbot – Backend n8n Workflows

This directory contains the export JSON files for all 4 workflows running on the live **n8n Cloud backend** (`tejiri-dev08.app.n8n.cloud`). Together, they provide the AI orchestration, retrieval grounding, lead capture, automated knowledge synchronization, and centralized operational alerting.

---

## Workflow Architecture Overview

```
                          ┌──────────────────────────────────────┐
                          │     Next.js 14 API Proxy Layer       │
                          └──────┬──────────────┬──────────────┬─┘
                                 │              │              │
           POST /api/chat        │              │              │ GET /api/health
                                 │              │              │
                                 ▼              │              ▼
┌──────────────────────────────────────┐        │    ┌───────────────────────────────────┐
│  01. PW Chatbot - Alice Agent        │        │    │  03. PW Chatbot - Health Webhook  │
│  - Input sanitization & rate limiting│        │    │  - Returns { status: "ok" }       │
│  - LangChain Memory Window           │        │    └───────────────────────────────────┘
│  - Pinecone Assistant Tool Context   │        │
│  - GPT-5-mini Reasoning Model        │        │ POST /api/lead
│  - Output Guardrails & Verification  │        │
└──────────────────┬───────────────────┘        ▼
                   │             ┌───────────────────────────────────┐
                   │             │  03. PW Chatbot - Lead Webhook    │
                   │             │  - Validates name, email, consent │
                   │             │  - Enforces session rate limit    │
                   │             │  - Saves to 'pw_leads' Data Table │
                   │             └─────────────────┬─────────────────┘
                   │                               │
                   ▼                               ▼
┌────────────────────────────────────────────────────────────────────┐
│  04. PW Chatbot - Error Handler (Telegram)                         │
│  - Centralized Error Trigger node attached to all workflows        │
│  - Sends instant alert to Telegram on any failure:                 │
│    (Workflow name, failed node, error message, execution URL)      │
└────────────────────────────────────────────────────────────────────┘

                                 ▲
                                 │ (Error monitoring)
┌────────────────────────────────┴───────────────────────────────────┐
│  02. PW Chatbot - Knowledge Base Refresh                           │
│  - Weekly cron schedule + protected webhook (/webhook/alice-refresh│
│  - Respects robots.txt with transparent User-Agent                 │
│  - Polite crawling (1 req / 1.1s) across 7 official URLs           │
│  - Cleans HTML, chunks content, syncs revised files to Pinecone    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 1. `01-alice-agent.json` (PW Chatbot - Alice Agent)
- **Webhook Endpoint:** `POST /webhook/alice-chat`
- **Responsibilities:**
  - **Security & Rate Limiting:** Enforces maximum message length (1,000 characters), validates alphanumeric session IDs, and caps sessions at 12 messages/min (1,500 daily cap).
  - **Conversational Memory:** Uses LangChain's Window Buffer Memory to preserve multi-turn history (enables questions like *"And what about recovery time?"* to remember the context of adenocarcinoma).
  - **Pinecone Tool Retrieval:** Automatically constructs standalone English search queries to retrieve relevant semantic chunks from the 7 PlacidWay source pages.
  - **Output Guardrails:** Enforces price whitelisting, bans unverified clinical claims, ensures strict PlacidWay URL attribution, and determines flags (`show_disclaimer`, `show_lead_form`, `show_quote_cta`).

## 2. `02-knowledge-base-refresh.json` (PW Chatbot - Knowledge Base Refresh)
- **Triggers:** Manual trigger, weekly cron schedule (`0 3 * * 1`), and protected webhook `POST /webhook/alice-refresh` (requires Header Auth).
- **Responsibilities:**
  - **Robots.txt Adherence:** Fetches `https://www.placidway.com/robots.txt` and tests all 7 target paths before proceeding.
  - **Polite Crawling:** Uses User-Agent `PWAssessmentBot/1.0` with a 1,100ms delay between fetches (1 req/sec).
  - **Deterministic Semantic Chunking:** Drops navigation and footers, preserves medical headings, formats tabular pricing rows, and computes page content hashes.
  - **Pinecone Cloud Synchronization:** Compares page hashes against the previous version; uploads the revised `.md` knowledge base file to Pinecone Assistant and safely prunes superseded files.

## 3. `03-lead-and-health-api.json` (PW Chatbot - Lead and Health API)
- **Endpoints:**
  - `POST /webhook/alice-lead`: Validates visitor name (letters only), email address, and mandatory contact consent. Rate-limits submissions (max 3/hour per session). Persists captured records directly to the **`pw_leads` Data Table** in n8n.
  - `GET /webhook/alice-health`: Lightweight uptime health-check endpoint returning service status and timestamp.

## 4. `04-error-handler-telegram.json` (PW Chatbot - Error Handler Telegram)
- **Trigger:** Built-in n8n **Error Trigger** node.
- **Responsibilities:**
  - Automatically activates whenever any node in the other 3 workflows throws an unhandled exception or upstream timeout.
  - Dispatches an immediate Telegram alert with markdown formatting:
    ```
    🚨 PW Chatbot error
    Workflow: PW Chatbot - Alice Agent
    Failed node: Pinecone Assistant
    Error: Connection timeout
    Execution: https://tejiri-dev08.app.n8n.cloud/execution/12345
    ```
  - Guarantees 24/7 observability and zero silent drops.

---

## Import Instructions
1. In your n8n workspace, navigate to **Workflows**.
2. Click **Add Workflow** -> open the top-right menu `...` -> select **Import from File**.
3. Select any of the `.json` files in this directory.
4. Attach your credentials (OpenAI, Pinecone Header Auth, Telegram).
5. Toggle the workflow to **Active / Published**.
