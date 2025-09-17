import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AI_REQUEST_FREE_TIER_LIMIT } from "@/lib/constants";
import { BarChart3, CreditCard, Lock, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const featureHighlights = [
  {
    title: "AI copilot included",
    description:
      "Ship a conversational assistant that understands your usage data and customer history from day one.",
    icon: Sparkles,
  },
  {
    title: "Usage limits enforced",
    description: `Track free-tier quotas automatically with ${AI_REQUEST_FREE_TIER_LIMIT} responses before prompting upgrades.`,
    icon: ShieldCheck,
  },
  {
    title: "Secure authentication",
    description: "Passwordless email and OAuth providers are wired up so you can focus on product logic.",
    icon: Lock,
  },
  {
    title: "Subscription billing",
    description: "Polar billing integration with customer portals, invoices, and plan management.",
    icon: CreditCard,
  },
  {
    title: "Usage analytics dashboard",
    description: "Understand adoption with daily, weekly, and monthly usage trends ready to ship.",
    icon: BarChart3,
  },
];

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-background via-background to-muted/40">
      <div className="container mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 md:px-6 md:py-24">
        <section className="space-y-8 text-center">
          <span className="bg-primary/10 text-primary inline-flex items-center justify-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3" /> AI SaaS boilerplate
          </span>
          <h1 className="text-pretty text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Build and launch your AI product in days, not months
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-base md:text-lg">
            Tweak AI packages authentication, subscription billing, usage metering, and an AI copilot so you can focus on the
            customer experience instead of wiring infrastructure.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/ai">Open AI Studio</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">View dashboard</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureHighlights.map((feature) => (
            <Card key={feature.title} className="flex flex-col">
              <CardHeader className="space-y-2">
                <div className="bg-primary/10 text-primary inline-flex size-10 items-center justify-center rounded-full">
                  <feature.icon className="size-5" />
                </div>
                <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-muted/40" />
            <CardHeader className="relative space-y-4">
              <CardTitle className="text-2xl font-semibold">Usage limits out of the box</CardTitle>
              <CardDescription>
                Keep trials sustainable with baked-in request tracking. We handle metering and upgrade prompts so your users know
                exactly when to upgrade.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="rounded-lg border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Free tier</p>
                <p className="mt-1 text-2xl font-semibold">{AI_REQUEST_FREE_TIER_LIMIT} responses each month</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Automatically open the upgrade dialog when customers hit their limits. No manual tracking required.
                </p>
              </div>
              <div className="rounded-lg border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Real-time alerts</p>
                <p className="mt-1 text-2xl font-semibold">Usage monitoring with rate limits</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Upstash rate limiting and request logging keep your AI APIs reliable for every launch.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Everything founders need to start</CardTitle>
              <CardDescription>
                Skip boilerplate setup. Each module is documented and production ready.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold">
                  01
                </span>
                <div>
                  <p className="font-medium">Secure auth flows</p>
                  <p className="text-muted-foreground">
                    Multi-provider login, passwordless support, and session management powered by Lucia.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold">
                  02
                </span>
                <div>
                  <p className="font-medium">Billing automation</p>
                  <p className="text-muted-foreground">
                    Polar billing integration with hosted checkout, invoices, and customer portal.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold">
                  03
                </span>
                <div>
                  <p className="font-medium">Analytics-ready data</p>
                  <p className="text-muted-foreground">
                    Drizzle ORM schema for AI usage and subscriptions so you can extend reporting quickly.
                  </p>
                </div>
              </div>
            </CardContent>
            <Separator className="my-4" />
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/pricing">See full feature list</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-3xl border bg-muted/30 p-10 text-center">
          <h2 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">Launch your next AI feature faster</h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base">
            Tweak AI handles the heavy lifting so you can focus on customer problems. Start free, keep your stack flexible, and
            scale confidently when you hit traction.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/ai">Try the AI copilot</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">Compare plans</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
