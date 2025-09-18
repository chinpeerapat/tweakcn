import { recordAIUsage } from "@/actions/ai-usage";
import { handleError } from "@/lib/error-response";
import { getCurrentUserId, logError } from "@/lib/shared";
import { validateSubscriptionAndUsage } from "@/lib/subscription";
import { ChatRequestBody, ChatResponseBody } from "@/types/ai";
import { SubscriptionRequiredError } from "@/types/errors";
import { createGoogleGenerativeAI, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { generateText } from "ai";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const model = google("gemini-2.5-pro");

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "60s"),
});

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1),
});

const SYSTEM_PROMPT = `You are the co-pilot for an AI SaaS platform called Tweak AI.
You help founders understand how their users engage with generative AI features.
Respond with concise, actionable recommendations grounded in product analytics, billing, and usage insights.`;

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);
    const headersList = await headers();

    if (process.env.NODE_ENV !== "development") {
      const ip = headersList.get("x-forwarded-for") ?? "anonymous";
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);

      if (!success) {
        return new Response("Rate limit exceeded. Please try again later.", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        });
      }
    }

    const subscriptionCheck = await validateSubscriptionAndUsage(userId);

    if (!subscriptionCheck.canProceed) {
      throw new SubscriptionRequiredError(subscriptionCheck.error, {
        requestsRemaining: subscriptionCheck.requestsRemaining,
      });
    }

    const body = (await req.json()) as ChatRequestBody;
    const { messages } = requestSchema.parse(body);

    const { text, usage } = await generateText({
      model,
      system: SYSTEM_PROMPT,
      messages,
      abortSignal: req.signal,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 64,
          },
        } satisfies GoogleGenerativeAIProviderOptions,
      },
    });

    if (usage) {
      try {
        await recordAIUsage({
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
        });
      } catch (error) {
        logError(error as Error, { action: "recordAIUsage", usage });
      }
    }

    const responseBody: ChatResponseBody = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: text,
      createdAt: Date.now(),
    };

    return new Response(JSON.stringify(responseBody), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "ResponseAborted")
    ) {
      return new Response("Request aborted by user", { status: 499 });
    }

    return handleError(error, { route: "/api/chat" });
  }
}
