import { Metadata } from "next";

import { ChatPanel } from "@/components/ai/chat-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "AI Workspace — Tweak AI",
  description:
    "Collaborate with an insights co-pilot that understands your product analytics, billing, and usage limits.",
};

const productivityTips = [
  {
    title: "Summarize usage",
    description: "Ask for weekly highlights to understand which features resonate most.",
  },
  {
    title: "Troubleshoot billing",
    description: "Quickly craft responses for churned customers using their invoice history.",
  },
  {
    title: "Plan retention plays",
    description: "Combine AI feedback with usage cohorts to prioritize onboarding experiments.",
  },
];

export default function AiPage() {
  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/40 flex flex-1 flex-col">
      <div className="container mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-12 md:px-6 lg:py-16">
        <header className="space-y-4">
          <span className="bg-primary/10 text-primary inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold">
            AI Studio
          </span>
          <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Collaborate with your product co-pilot
          </h1>
          <p className="text-muted-foreground max-w-2xl text-pretty text-base">
            Centralize research, billing handoffs, and usage questions inside a single AI workspace. Every response is grounded in
            the latest customer activity so you ship confidently.
          </p>
        </header>

        <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <ChatPanel />

          <aside className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What teams ask</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  The copilot has access to your usage analytics and subscription state. Try questions like:
                </p>
                <ul className="space-y-3">
                  <li className="rounded-md border px-3 py-2 text-foreground">
                    &ldquo;Which customers are close to hitting their AI quota?&rdquo;
                  </li>
                  <li className="rounded-md border px-3 py-2 text-foreground">
                    &ldquo;Draft an email for teams who churned this week.&rdquo;
                  </li>
                  <li className="rounded-md border px-3 py-2 text-foreground">
                    &ldquo;Summarize the biggest drop-offs from onboarding.&rdquo;
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Make the most of Pro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Upgrade for unlimited responses, team workspaces, and exportable analytics. Here are a few workflows founders
                  love:
                </p>
                <Separator />
                <ul className="space-y-3">
                  {productivityTips.map((tip) => (
                    <li key={tip.title} className="space-y-1">
                      <p className="text-foreground text-sm font-medium">{tip.title}</p>
                      <p>{tip.description}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
