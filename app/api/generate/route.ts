import { recordAIUsage } from "@/actions/ai-usage";
import { handleError } from "@/lib/error-response";
import { getCurrentUserId } from "@/lib/shared";
import { validateSubscriptionAndUsage } from "@/lib/subscription";
import { SubscriptionRequiredError } from "@/types/errors";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "60s"),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);

    if (process.env.NODE_ENV !== "development") {
      const { success } = await ratelimit.limit(userId);
      if (!success) {
        return new Response("Rate limit exceeded", { status: 429 });
      }
    }

    const subscriptionCheck = await validateSubscriptionAndUsage(userId);
    if (!subscriptionCheck.canProceed) {
      throw new SubscriptionRequiredError(subscriptionCheck.error, {
        requestsRemaining: subscriptionCheck.requestsRemaining,
      });
    }

    const { prompt } = await req.json();
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    if (response.usage) {
      await recordAIUsage({
        promptTokens: response.usage.input_tokens ?? 0,
        completionTokens: response.usage.output_tokens ?? 0,
      });
    }

    const text = response.output?.[0]?.content?.[0]?.text ?? "";
    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleError(error, { route: "/api/generate" });
  }
}
