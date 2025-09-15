"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { format } from "date-fns";

export function DashboardSummary() {
  const { subscriptionStatus, isPending } = useSubscription();

  const isSubscribed = subscriptionStatus?.isSubscribed ?? false;
  const requestsRemaining = subscriptionStatus?.requestsRemaining;
  const requestsUsed = subscriptionStatus?.requestsUsed;

  const today = format(new Date(), "PP");

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Today&apos;s status</CardTitle>
          <CardDescription>Your workspace usage snapshot as of {today}.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold">{isPending ? "—" : requestsUsed ?? 0}</span>
          <span className="text-muted-foreground text-sm">total responses recorded</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Remaining capacity</CardTitle>
          <CardDescription>
            {isSubscribed
              ? "Pro plans include unlimited responses."
              : "Keep an eye on your remaining free-tier requests."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold">
            {isSubscribed ? "∞" : typeof requestsRemaining === "number" ? requestsRemaining : "—"}
          </span>
          <span className="text-muted-foreground text-sm">
            {isSubscribed ? "Unlimited responses" : "responses left this cycle"}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
