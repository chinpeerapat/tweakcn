import { recordAIUsage } from "@/actions/ai-usage";
import { handleError } from "@/lib/error-response";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getCurrentUserId } from "@/lib/shared";
import { requireSubscriptionOrFreeUsage } from "@/lib/subscription";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import OpenAI from "openai";
import { NextRequest } from "next/server";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: NextRequest) {
  try {
    // Auth + subscription check (throws if unauthorized or over free quota)
    const _userId = await getCurrentUserId(req);
    await requireSubscriptionOrFreeUsage(req);

    // Rate limit (returns a 429 response when exceeded)
    const limited = await enforceRateLimit(req);
    if (limited) return limited;

    const body = await req.json().catch(() => ({}));
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
      : [{ role: "user", content: body?.prompt ?? "Hello" }];

    const provider = (process.env.AI_PROVIDER || "google").toLowerCase();
    const url = new URL(req.url);
    const stream = url.searchParams.get("stream") === "1";
    let text = "";

    if (provider === "openai" && process.env.OPENAI_API_KEY) {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL_ID || "gpt-4o-mini",
        messages,
      });
      text = completion.choices?.[0]?.message?.content ?? "";

      if (completion.usage) {
        await recordAIUsage({
          promptTokens: completion.usage.prompt_tokens || 0,
          completionTokens: completion.usage.completion_tokens || 0,
        });
      }
    } else if (process.env.GOOGLE_API_KEY) {
      const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
      const model = google(process.env.GOOGLE_MODEL_ID || "gemini-2.5-pro");

      // Basic prompt join for demo purposes
      const prompt = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
      if (stream) {
        const result = streamText({ model, prompt, abortSignal: req.signal });
        return result.toDataStreamResponse();
      } else {
        const { text: outText, usage } = await generateText({
          model,
          prompt,
          abortSignal: req.signal,
        });
        text = outText;

        if (usage) {
          await recordAIUsage({
            promptTokens: usage.promptTokens || 0,
            completionTokens: usage.completionTokens || 0,
          });
        }
      }
    } else {
      return new Response(
        "No AI provider configured. Set AI_PROVIDER=openai with OPENAI_API_KEY or AI_PROVIDER=google with GOOGLE_API_KEY.",
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ text }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "ResponseAborted")
    ) {
      return new Response("Request aborted by user", { status: 499 });
    }

    return handleError(error, { route: "/api/ai/chat" });
  }
}
