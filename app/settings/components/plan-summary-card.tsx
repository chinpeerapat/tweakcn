"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import Link from "next/link";

export function PlanSummaryCard() {
  const { subscriptionStatus, isPending } = useSubscription();

  const isPro = subscriptionStatus?.isSubscribed ?? false;
  const requestsRemaining = subscriptionStatus?.requestsRemaining;
  const requestsUsed = subscriptionStatus?.requestsUsed ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Plan overview</CardTitle>
        <CardDescription>
          Monitor your usage limit and upgrade when you are ready to scale your AI features.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Current plan</p>
          <p className="mt-1 text-2xl font-semibold">{isPro ? "Pro" : "Free"}</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {isPro ? "Enjoy unlimited responses and team collaboration features." : "Get started with free requests and upgrade when you need more."}
          </p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Usage this month</p>
          <p className="mt-1 text-2xl font-semibold">{isPending ? "—" : requestsUsed}</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {isPro
              ? "Usage is unlimited for Pro customers."
              : typeof requestsRemaining === "number"
                ? `${requestsRemaining} responses remaining in the free tier.`
                : "Checking remaining responses..."}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-xs">
          Upgrade to unlock unlimited AI responses, team seats, and advanced analytics exports.
        </p>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/pricing">Explore plans</Link>
          </Button>
          {isPro ? (
            <Button asChild>
              <Link href="/settings/portal">Manage billing</Link>
            </Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
