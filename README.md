# AI SaaS Boilerplate

This repository provides a starter kit for building AI-powered SaaS applications with Next.js. It includes authentication, subscription management, rate limiting, and an example AI endpoint.

## Features
- **Next.js App Router** with TypeScript and Tailwind CSS.
- **Better Auth** integration with GitHub and Google providers.
- **Usage-based subscriptions** backed by Polar.
- **Rate limited AI API route** using Upstash.
- **Example text generation endpoint** at `app/api/generate/route.ts`.

## Getting Started
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/jnsahaj/tweakcn.git
   cd tweakcn
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the required values:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - OAuth keys (`GITHUB_CLIENT_ID`, `GOOGLE_CLIENT_ID`, ...)
   - `NEXT_PUBLIC_PRO_PLAN_PRODUCT_ID`
   - `POLAR_ACCESS_TOKEN`
   - `POLAR_WEBHOOK_SECRET`
3. Run the development server:
   ```bash
   npm run dev
   ```

## Example AI Route
The file `app/api/generate/route.ts` shows how to call an AI model and stream the response back to the client while enforcing rate limits and subscription status.

## License
MIT
