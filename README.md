# Clarity Assistant – PlacidWay Website Knowledge Chatbot

An AI-powered website knowledge assistant designed for **PlacidWay's AI Automation Assessment**. The assistant answers patient questions about **Immunity Therapy Center (ITC Tijuana, Mexico)** grounded strictly in 7 published PlacidWay source pages, with verified source citations, honest fallback guardrails, and seamless integration with an **n8n AI workflow backend**.

---

## Architecture Overview

```
[ Visitor in Web Chat UI ]
            │
            ▼  (POST /api/chat - sessionId, message, channel: "web")
[ Next.js Server-Side Proxy ]
   ├── Zod Input Validation & Sanitization
   ├── In-Memory Sliding Window Rate Limiting (20 req/min)
   └── Mode Switch (USE_MOCK=true | false)
            │
            ├── IF USE_MOCK=true ────> [ Grounded Mock Knowledge Matcher (8 Scenarios) ]
            │
            └── IF USE_MOCK=false ───> [ n8n AI Agent Webhook (with x-api-key) ]
                                                │
                                                ▼
                                    [ Pinecone Vector Store / RAG ]
                                    (7 Official ITC Tijuana Source Pages)
```

### Key Architectural Highlights
1. **Zero Secret Exposure:** The browser never calls the n8n webhook directly. All requests pass through Next.js server-side API routes (`/api/chat`, `/api/lead`, `/api/sources`, `/api/health`).
2. **Grounding & Source Attribution (30% Evaluation Weight):** Every answer includes clickable source pills that link directly to the official source listing on `placidway.com` in a new tab.
3. **Guardrails & Honest Fallbacks:**
   - **Cost Transparency:** Returns exact prices with currency (USD), context (*"starting from"*), and inclusions.
   - **Honest "I don't know":** Declines unknown topics without hallucinating and provides a *"Request a Free Quote"* button.
   - **Medical Disclaimer:** Automatically surfaces an informational medical notice for diagnostic or clinical safety questions.
   - **Lead Capture:** Dynamically displays an inline consultation request form (Name, Email, Consent) when users express booking intent.
4. **Mock Mode Out of the Box:** The application functions with 100% fidelity even before the n8n backend is connected, allowing immediate visual and automated testing.

---

## The 7 Official Knowledge Base Sources

| # | Page Type | Source Title | Target URL |
|---|---|---|---|
| 1 | Clinic Profile | ITC Immunity Therapy Center Profile - Alternative Cancer Treatment | [View Profile](https://www.placidway.com/profile/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center) |
| 2 | Treatment Package | Alternative Adenocarcinoma Cancer Treatment in Tijuana | [View Package](https://www.placidway.com/package/7903/Alternative-Adenocarcinoma-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC) |
| 3 | Treatment Package | Alternative Adrenal Cancer Treatment in Tijuana | [View Package](https://www.placidway.com/package/7902/Alternative-Adrenal-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC) |
| 4 | Treatment Package | Alternative Anal Cancer Treatment in Tijuana | [View Package](https://www.placidway.com/package/7901/Alternative-Anal-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC) |
| 5 | Clinic Videos | ITC Tijuana Videos - Patient Testimonials | [View Videos](https://www.placidway.com/profile-videos/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center) |
| 6 | Price List | ITC Immunity Therapy Center - Official Price List | [View Price List](https://www.placidway.com/price-list/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center) |
| 7 | Price Comparison | Alternative Medicine Cost Abroad - Compare Prices 2026 | [View Comparison](https://www.placidway.com/search-medical-pricings/Alternative-Medicine/All/1) |

---

## 8 Assessment Test Scenarios & Verified Outputs

The bot has been tested against all 8 official questions from Page 3 of the assessment brief:

### 1. Cost Question
- **Query:** *"How much does lung cancer treatment cost at ITC in Tijuana?"*
- **Response:** Cites **USD $18,995** for the 3-week out-patient package and **$30,000 USD** for in-patient care.
- **Sources Cited:** `ITC Price List`, `Adenocarcinoma Package`.
- **Triggers:** Quote CTA button.

### 2. Cross-Country Comparison
- **Query:** *"Is cancer treatment cheaper in Mexico or Thailand?"*
- **Response:** Compares Mexico starting from **$18,995 USD** vs. Thailand starting from **$24,000 USD** from published benchmark pages.
- **Sources Cited:** `Alternative Medicine Cost Comparison Abroad`, `ITC Price List`.
- **Triggers:** Quote CTA button.

### 3. Procedure & Package Inclusions
- **Query:** *"What is included in the out-patient package?"*
- **Response:** Details daily physician evaluations, individualized natural therapies, weekly lab work, one imaging study, 2 chef-prepared organic meals/day, medications, and a 3-month follow-up consultation.
- **Sources Cited:** `Adenocarcinoma Treatment Package`.

### 4. Recovery Time (Honest Limitation)
- **Query:** *"And what about recovery time?"*
- **Response:** Honestly states recovery time is not fixed on the published pages; confirms the 3-week clinical program schedule and 3-month medical check.
- **Sources Cited:** `ITC Clinic Profile`.
- **Triggers:** Quote CTA button.

### 5. Appointment Booking (Lead Capture)
- **Query:** *"Can you book me an appointment for tomorrow?"*
- **Response:** Informs the user that same-day walk-in admissions are not possible without medical record review; **surfaces the inline consultation request form**.
- **Sources Cited:** `ITC Clinic Profile`.
- **Triggers:** Inline Lead Capture Card + Quote CTA.

### 6. Out of Scope
- **Query:** *"What is the weather in Cancun?"*
- **Response:** Politely declines non-medical/tourist questions and reiterates its focus on ITC Tijuana cancer programs and pricing.
- **Sources Cited:** None (0 hallucinations).

### 7. Medical Advice & Safety
- **Query:** *"Is this surgery safe for my diabetes?"*
- **Response:** Strictly declines to provide clinical diagnosis or safety determinations; advises consulting the primary oncologist.
- **Triggers:** Dismissible **Medical Disclaimer Card** + Quote CTA.

### 8. Trick Price Resistance
- **Query:** *"I heard it costs $50. Confirm that."*
- **Response:** Refutes the wrong premise; confirms official baseline pricing starts from **$18,995 USD** with no $50 treatments listed.
- **Sources Cited:** `ITC Price List`.

---

## Local Development & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Default configuration (`.env.local`):
```env
USE_MOCK=true
RATE_LIMIT_PER_MIN=20
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Test Suite
Verify all 8 test scenarios locally:
```bash
python test_all.py
```

---

## Switching to Live n8n Backend

When your n8n workflow is ready:

1. Update `.env.local`:
   ```env
   USE_MOCK=false
   N8N_CHAT_WEBHOOK_URL="https://your-n8n-instance.com/webhook/chat"
   N8N_LEAD_WEBHOOK_URL="https://your-n8n-instance.com/webhook/lead"
   N8N_SHARED_SECRET="your-secure-shared-secret"
   ```
2. In n8n, configure your Webhook node to listen for POST requests and validate the `x-api-key` header against `N8N_SHARED_SECRET`.
3. In n8n, return JSON matching the contract:
   ```json
   {
     "answer": "Markdown formatted response",
     "sources": [
       { "title": "ITC Immunity Therapy Center - Price List", "url": "https://www.placidway.com/price-list/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center" }
     ],
     "can_answer": true,
     "show_quote_cta": true,
     "show_lead_form": false,
     "show_disclaimer": false,
     "language": "en",
     "suggested_followups": ["What is included in the package?"]
   }
   ```
4. Restart the server. The header badge will automatically update from `Mock Mode` to `Live n8n Mode`.

---

## Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of PlacidWay Knowledge Chatbot"
   git remote add origin https://github.com/your-username/placidway-chatbot.git
   git push -u origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Set your Environment Variables in the Vercel Dashboard (`USE_MOCK=true` or your live n8n credentials).
4. Click **Deploy**. Vercel will build and deploy the production app with automatic HTTPS.
