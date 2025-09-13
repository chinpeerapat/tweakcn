# AI App Starter (using this codebase)

This repo is now ready to use as an AI app starter with auth, payments, and rate limiting out of the box. It includes:

- Auth via `better-auth` (email/password + Google/GitHub)
- Subscriptions via Polar (checkout, webhooks, customer portal)
- API rate limiting via Upstash/Vercel KV
- A generic AI Chat API (`/api/ai/chat`) wired to Google Gemini or OpenAI
- A minimal demo page at `/starter` to exercise auth + AI chat

## Quick Start

1) Copy env template and fill values:

```bash
cp .env.example .env
```

Populate values for database, auth, one AI provider (Google or OpenAI), and Polar.

2) Install deps and run dev server:

```bash
pnpm install
pnpm dev
```

3) Visit the demo page:

- Open http://localhost:3000/starter
- Sign in, ask a question, and see results from `/api/ai/chat`

## Configuration

- AI provider selection: set `AI_PROVIDER` to `google` or `openai`.
  - Google: `GOOGLE_API_KEY` (and optional `GOOGLE_MODEL_ID`)
  - OpenAI: `OPENAI_API_KEY` (and optional `OPENAI_MODEL_ID`)
- Polar product ID:
  - Prefer `NEXT_PUBLIC_PRO_PRODUCT_ID`
  - Legacy name still works: `NEXT_PUBLIC_TWEAKCN_PRO_PRODUCT_ID`
- Rate limit: hard-coded to 5 requests / 60 seconds by IP in `lib/rate-limit.ts`.
  - In development, rate limiting is skipped.
  - In production, configure Vercel KV or Upstash KV via `KV_REST_API_URL`, `KV_REST_API_TOKEN`.

## Key Files

- `/api/ai/chat` — Generic chat endpoint with auth + subscription + rate-limit
- `/starter` — Minimal UI to test sign in and the chat endpoint
- `app/api/webhook/polar` — Polar webhook to upsert subscriptions
- `app/settings/portal` — Polar customer portal session
- `lib/subscription.ts` — Subscription checks + free-tier limits
- `lib/rate-limit.ts` — Shared rate-limit utility

## Notes

- The existing app features (editor, pricing, etc.) remain available.
- Middleware protects `/starter` and other authenticated routes.
- The free tier limit and product gating logic live in `lib/subscription.ts` and `actions/ai-usage.ts`.

