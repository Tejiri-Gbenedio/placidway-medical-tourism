# Build brief: Website Knowledge Chatbot frontend

## 1. Goal and constraints

Build a single-page web chat app for a demo chatbot that answers questions about one medical-tourism clinic using only 7 source pages. A separate backend (n8n) is built later, so this frontend must work today against a **mock backend** and switch to the real backend by changing environment variables only.

- **Do not** invent backend logic. The backend contract is in section 6 and is final.
- **Do not** copy any third-party brand assets, logos, photos or website copy.
- **Never** call the n8n webhook from the browser. All calls go through Next.js API routes.
- **No secrets** in the repo or in client code.
- After each phase in section 12, run lint, type-check and build, and fix errors before continuing.

## 2. Stack

Next.js (App Router) with TypeScript, Tailwind CSS, `lucide-react` for icons, `react-markdown` with `rehype-sanitize` for rendering answers, `zod` for validating requests and responses, `next/font` for fonts. Keep dependencies minimal. Deploy target is Vercel.

## 3. Brand (placeholders)

Create `config/brand.ts` exporting `APP_NAME` (default "Clarity Assistant"), `TAGLINE`, `QUOTE_URL` (`https://www.placidway.com/request-info`) and `CONTACT_PHONE` (`+1-888-296-6664`). Generate a simple original SVG mark in `public/logo.svg` (a rounded chat-bubble with a leaf or spark). It will be replaced later, so reference it from one place only.

## 4. Visual design

Warm, calm and reassuring, with a cream-to-peach feel and a coral accent.

| Token | Value (approx.) |
|---|---|
| `--bg` | `#FFF8F3` (page), with a soft radial peach gradient behind the hero |
| `--surface` | `#FFFFFF` |
| `--peach` | `#FFE9DF` (assistant bubbles, chips) |
| `--accent` | `#E8574D` (buttons, links, user bubble tint) |
| `--accent-dark` | `#C9433A` |
| `--text` | `#2B2B33` |
| `--muted` | `#6B6B76` |
| `--border` | `#F0D9CF` |

- **Shape:** card radius 20–24px, bubbles 18px, pill chips, soft layered shadows. Use `Open Sans` or a similar humanist sans via `next/font`.
- **Motion:** subtle only (message fade/slide-in, typing dots). Respect `prefers-reduced-motion`.
- **Dark mode:** not required.
- **Contrast:** meet WCAG AA, and the coral on white must pass for button text.

## 5. Layout and components

**Desktop (≥1024px):** header, a short hero, then a two-column grid (chat about 2/3, side panel about 1/3).
**Mobile:** single column with the chat first. The side panel becomes a collapsible "Suggested questions and sources" section below it. The composer is pinned to the bottom and respects iOS safe areas.

- **Header:** logo and `APP_NAME`, a "New chat" button, and a small "Demo" badge.
- **Hero:** one headline (for example "Ask about programs, prices and what's included") and one subline saying answers come only from 7 public pages.
- **Footer:** "Independent demo built for the PlacidWay AI Automation assessment. Not affiliated with any clinic. Answers come only from seven public pages and may be out of date. This is not medical advice."

### Chat panel

- **Header bar:** avatar (bot icon), name, subtitle "Answers from 7 source pages", and a green status dot driven by `/api/health`.
- **Message list:**
  - Assistant messages on the left in peach bubbles, user messages on the right in coral-tinted bubbles.
  - Assistant text is rendered as sanitized markdown (bold, lists, links).
  - Links are allowed only for `https://www.placidway.com/*`, `tel:` and `mailto:`. Render other links as plain text. Add `target="_blank"` and `rel="noopener noreferrer"` to external links.
- **Under each assistant message:**
  - Source chips (title, with an external-link icon).
  - A "Request a free quote" button when `show_quote_cta` is true.
  - An inline lead form card when `show_lead_form` is true.
  - Up to 3 follow-up chips from `suggested_followups`, which send the text when clicked.
- **When `can_answer` is false:** use a visibly neutral style (soft grey-peach border, info icon) and always show the quote CTA.
- **Disclaimer:** when `show_disclaimer` is true and none has been shown this session, show a small dismissible info card above that answer. Never show it twice per session.
- **Typing indicator:** three animated dots while waiting.
- **Errors:** an error bubble with a Retry button. It must show a friendly message and never a stack trace.
- **Composer:**
  - An auto-growing textarea (max 5 rows), Enter to send, Shift+Enter for a newline.
  - A coral round send button, disabled while waiting or when empty.
  - A character counter appears at 800 of 1,000.
  - A footnote reads "Please don't share personal medical details."
- **Empty state:** a welcome message from the assistant plus the suggested questions.

### Side panel

- **Suggested questions** (click to send):
  - "How much does lung cancer treatment cost at ITC in Tijuana?"
  - "What's included in the out-patient package?"
  - "What's the difference between out-patient and in-patient pricing?"
  - "Which cancer types are on the price list?"
  - "Which procedures cost extra?"
  - "How do I request a free quote?"
- **Knowledge sources:** the 7 pages as links, with a "last refreshed" time from `/api/sources`.
- **"What I can't do":** a short list (no bookings, no medical advice, only these 7 pages).

## 6. API contract (final)

### Browser to Next.js (internal routes)

| Route | Method | Purpose |
|---|---|---|
| `/api/chat` | POST | Send a message |
| `/api/lead` | POST | Submit name and email |
| `/api/sources` | GET | List sources and last refresh time |
| `/api/health` | GET | `{status:"ok", mode:"mock"\|"live"}` |

### Types (put in `lib/types.ts` and mirror with zod schemas)

```ts
type ChatRequest = { sessionId: string /* uuid */; message: string /* 1..1000 */; channel: "web" };

type Source = { title: string; url: string };

type ChatResponse = {
  answer: string;                 // markdown
  sources: Source[];
  can_answer: boolean;
  show_quote_cta: boolean;
  show_lead_form: boolean;
  show_disclaimer: boolean;
  language: string;               // e.g. "en", "es", "ar"
  suggested_followups?: string[]; // max 3
};

type LeadRequest = { sessionId: string; name: string; email: string; consent: true };
type LeadResponse = { ok: true };

type SourcesResponse = {
  last_refreshed: string | null;
  sources: { title: string; url: string; page_type: string; last_refreshed: string | null }[];
};

type ApiError = { error: { code: "invalid_input"|"rate_limited"|"upstream_timeout"|"upstream_error"; message: string } };
```

### Next.js to n8n (server-side only)

- The server POSTs the same `ChatRequest` JSON to `N8N_CHAT_WEBHOOK_URL` with the header `x-api-key: <N8N_SHARED_SECRET>`, and expects a `ChatResponse` as JSON.
- Same pattern for `N8N_LEAD_WEBHOOK_URL` (`LeadRequest` in, `LeadResponse` out).
- `N8N_SOURCES_WEBHOOK_URL` is optional. If missing, return the static source list from `config/sources.ts`.
- **Timeout:** 25 seconds, returning `upstream_timeout`.

## 7. API route behaviour

- **Validation:** parse every request and every upstream response with zod. A malformed upstream response becomes `upstream_error` with a friendly message, never a pass-through of raw data.
- **Sanitizing:** drop any `sources[].url` whose host is not `www.placidway.com` (defence in depth).
- **Rate limit:** in-memory per-IP limit (default 20 requests per minute, from `RATE_LIMIT_PER_MIN`). Return `rate_limited` with HTTP 429. Add a comment noting that this is best-effort on serverless.
- **Input:** trim, reject empty input, cap at 1,000 characters.
- **Headers:** set `X-Robots-Tag: noindex, nofollow`. Never log message contents or lead data.
- **Mode switch:** use mock mode when `USE_MOCK=true` or when `N8N_CHAT_WEBHOOK_URL` is missing. `/api/health` reports which mode is active.

## 8. Mock mode

Put all mock logic in `lib/mock/` so it can be deleted later. A keyword-based responder returns `ChatResponse` objects after an 800–1,500ms delay. Cover these 8 cases (the sources are the real URLs from section 11):

1. **Cost:** lung cancer cost → "The price list shows Lung Cancer at USD $18,995 (listed price). The package pages for adenocarcinoma, adrenal and anal cancer describe a 3-week out-patient program from $18,995 and a 3-week in-patient program at $30,000." Sources: price list and the adenocarcinoma package. `show_quote_cta: true`.
2. **Comparison:** Mexico vs Thailand cancer → ITC from $18,995 vs a Thailand listing from $24,000 on the comparison page, noting these are starting prices for different packages.
3. **Package contents:** out-patient inclusions: weekly lab work, one imaging study, two meals a day, standard medications, one follow-up consultation after 3 months.
4. **Follow-up:** "And recovery time?" → not stated on the pages. Mention the 3-week itinerary and the 3-month follow-up. `can_answer: false`, quote CTA on.
5. **Booking:** cannot book. The profile page says no slots are available and offers a virtual consultation request. `show_lead_form: true`.
6. **Out of scope:** weather → polite decline, with what the bot can help with.
7. **Medical advice:** diabetes safety → no medical advice, ask the user's own doctor, `show_disclaimer: true`.
8. **Trick price:** "I heard it costs $50" → cannot confirm, the listed price is $18,995.

Anything else returns a generic "I couldn't find that in the pages I have" response with `can_answer: false`. Add a visible but unobtrusive "Mock mode" badge in the header when `/api/health` reports `mode: "mock"`.

## 9. Behaviour details

- **Session:** generate a UUID `sessionId` and keep it in `localStorage` (wrapped in try/catch, with an in-memory fallback). "New chat" clears messages and creates a new session.
- **History:** keep messages in React state only. Do not persist the transcript.
- **Double submits:** disable sending while a request is pending. Cancel the pending request with `AbortController` on "New chat".
- **Retry:** the retry button resends the same message without duplicating the user bubble.
- **Lead form:**
  - Fields are name, email and a required consent checkbox.
  - Validate the email and show inline errors.
  - On success, replace the form with a thank-you line.
  - Never store or echo lead data in the transcript.
- **Scroll:** auto-scroll to the newest message unless the user scrolled up, and then show a "new message" pill.
- **Accessibility:**
  - The message list uses `role="log"` with `aria-live="polite"`.
  - Everything is keyboard operable, and focus returns to the composer after sending.
  - Buttons have labels and the page has a visible focus ring.
- **SEO:** `<meta name="robots" content="noindex,nofollow">`, a `robots.txt` that disallows all, a sensible title and a basic OG tag.
- **Performance:** no tracking scripts, no heavy libraries, and Lighthouse accessibility ≥ 95.

## 10. Environment variables (`.env.example`)

```
USE_MOCK=true
N8N_CHAT_WEBHOOK_URL=
N8N_LEAD_WEBHOOK_URL=
N8N_SOURCES_WEBHOOK_URL=
N8N_SHARED_SECRET=
RATE_LIMIT_PER_MIN=20
```

## 11. Sources (for `config/sources.ts` and the side panel)

| Title | URL |
|---|---|
| ITC Immunity Therapy Center profile | https://www.placidway.com/profile/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center |
| Adenocarcinoma cancer package | https://www.placidway.com/package/7903/Alternative-Adenocarcinoma-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC |
| Adrenal cancer package | https://www.placidway.com/package/7902/Alternative-Adrenal-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC |
| Anal cancer package | https://www.placidway.com/package/7901/Alternative-Anal-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC |
| ITC videos | https://www.placidway.com/profile-videos/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center |
| ITC price list | https://www.placidway.com/price-list/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center |
| Alternative medicine price comparison | https://www.placidway.com/search-medical-pricings/Alternative-Medicine/All/1 |

## 12. Phases for the agent

1. **Scaffold and design system:** project setup, Tailwind tokens, fonts, brand config, layout shell, header and footer.
2. **Chat UI with mock data:** all components, markdown rendering, typing indicator, empty state, suggested questions, the 8 mock cases, error and retry states.
3. **API routes:** the 4 routes, zod schemas, proxy logic, rate limit, mode switch. Add unit tests for the zod schemas and the mock responder.
4. **Side panel, lead form and polish:** sources panel, disclaimer card, lead form, accessibility pass, responsive pass, loading and empty states.
5. **Docs and deploy:** README, `.env.example`, Vercel notes, and a manual QA checklist.

## 13. File structure

```
app/ (layout.tsx, page.tsx, api/chat|lead|sources|health/route.ts)
components/ (ChatPanel, MessageBubble, TypingIndicator, SourceChips, SuggestedQuestions,
             SourcesPanel, QuoteCTA, LeadForm, DisclaimerNote, Header, Footer)
lib/ (types.ts, schemas.ts, n8n.ts, rateLimit.ts, session.ts, mock/)
config/ (brand.ts, sources.ts)
public/ (logo.svg, robots.txt)
README.md  .env.example  .gitignore
```

## 14. Definition of done

- Every one of the 8 mock scenarios renders correctly, including source chips, CTA, lead form and the one-time disclaimer.
- Switching to live mode needs only the env vars, with no code change.
- Works at 360px, 768px and 1280px widths, and is keyboard-only usable.
- `npm run build` and lint pass, with no `any` in the API layer and no secrets in the repo.
- The README covers local setup, the env vars, mock vs live mode, the API contract, and the steps to deploy on Vercel.

## 15. Deployment handoff

1. Push to GitHub (public repo, `.env*` ignored).
2. Import into Vercel and set the env vars, starting with `USE_MOCK=true`.
3. When n8n is ready, set the three webhook URLs and the shared secret, set `USE_MOCK=false`, and redeploy.
4. Run the 8 test questions against the live site, then check `/api/health` shows `mode: "live"`.
