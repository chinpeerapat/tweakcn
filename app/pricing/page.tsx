import { NoiseEffect } from "@/components/effects/noise-effect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AI_REQUEST_FREE_TIER_LIMIT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { FREE_SUB_FEATURES, PRO_SUB_FEATURES } from "@/utils/subscription";
import { Calendar, Check, Circle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

import { CheckoutButton } from "./components/checkout-button";

export const metadata: Metadata = {
  title: "Pricing — Tweak AI",
  description: "Choose the plan that lets you ship AI SaaS features with confidence.",
};

export default function PricingPage() {
  return (
    <div className="from-background via-background to-muted/20 relative isolate min-h-screen bg-gradient-to-br">
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute top-0 right-0 size-80 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
        <div className="bg-secondary/10 absolute bottom-0 left-0 size-80 -translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto space-y-24 px-4 py-20 md:px-6">
        <section className="space-y-6 text-center">
          <span className="bg-primary/10 text-primary inline-flex items-center justify-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3" /> Launch-ready SaaS
          </span>
          <h1 className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
            Pricing built for ambitious builders
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-base text-balance md:text-lg">
            Get started for free, validate your product, and upgrade when you need unlimited AI usage and team collaboration.
          </p>
        </section>

        <section className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-12">
          <Card className="group relative flex flex-col overflow-hidden border-2 transition-all duration-300">
            <CardHeader className="space-y-2 border-b">
              <CardTitle className="text-4xl font-medium">Free</CardTitle>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tight lg:text-5xl">$0</span>
                <span className="text-muted-foreground text-lg">/month</span>
              </div>
              <p className="text-muted-foreground text-sm">No credit card required</p>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              <ul className="space-y-3">
                {FREE_SUB_FEATURES.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-primary/15 flex items-center justify-center rounded-full p-1">
                      {feature.status === "done" ? (
                        <Check className="text-primary size-3 stroke-2" />
                      ) : (
                        <Circle className="text-muted-foreground size-3 stroke-2" />
                      )}
                    </div>
                    <span className="text-sm">{feature.description}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="h-12 w-full text-base font-medium" size="lg">
                <Link href="/ai">Launch AI Studio</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="group ring-primary/50 from-card to-primary/5 relative border-2 bg-gradient-to-b ring-2 transition-all duration-300">
            <div className="relative flex h-full flex-col">
              <CardHeader className="relative space-y-2 border-b">
                <NoiseEffect />
                <CardTitle className="text-4xl font-medium">Pro</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight lg:text-5xl">$12</span>
                  <span className="text-muted-foreground text-lg">/month</span>
                </div>
                <p className="text-muted-foreground text-sm">Billed monthly • Cancel anytime</p>
              </CardHeader>
              <CardContent className="flex-1 pt-6">
                <p className="text-muted-foreground mb-4 text-sm font-medium">
                  Everything in Free, plus:
                </p>
                <ul className="space-y-3">
                  {PRO_SUB_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-full p-1",
                          feature.status === "done" ? "bg-primary/15" : "bg-muted-foreground/25"
                        )}
                      >
                        {feature.status === "done" ? (
                          <Check className="text-primary size-3 stroke-2" />
                        ) : (
                          <Calendar className="text-muted-foreground size-3 stroke-2" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          feature.status === "done" ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {feature.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <CheckoutButton size="lg" className="h-12 w-full text-base font-medium" />
              </CardFooter>
            </div>
          </Card>
        </section>

        <section className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
              FAQs
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base text-balance md:text-lg">
              Everything you need to know about limits, billing, and collaboration.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {PRICING_FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/40 group border-b py-2">
                <AccordionTrigger className="group-hover:text-primary text-left font-medium transition-colors hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}

const PRICING_FAQS = [
  {
    question: "What do I get when I upgrade to Pro?",
    answer:
      "Pro unlocks unlimited AI responses, team collaboration spaces, exportable analytics, and priority support so you can move quickly with your customers.",
  },
  {
    question: "Can I stay on the free plan?",
    answer: `Yes. The free tier includes authentication, billing integration, and ${AI_REQUEST_FREE_TIER_LIMIT} AI responses per month so you can validate your product before upgrading.`,
  },
  {
    question: "Do I need my own API keys?",
    answer:
      "Bring your own keys for production workloads. Local development works out of the box with your environment secrets.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. Manage your subscription directly inside the billing portal — no hidden fees or lock-in.",
  },
];
