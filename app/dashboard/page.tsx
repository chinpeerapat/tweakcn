import { UsageStats } from "@/app/settings/components/usage-stats";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardSummary } from "./components/dashboard-summary";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <div className="container mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 md:px-6 lg:py-16">
      <header className="space-y-4">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
          Monitor adoption at a glance
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
          Track AI usage, billing outcomes, and collaboration so you can launch new capabilities with confidence.
        </p>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/ai">Open AI Studio</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/settings/usage">View detailed analytics</Link>
          </Button>
        </div>
      </header>

      <DashboardSummary />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Usage trends</h2>
          <p className="text-muted-foreground text-sm">
            Explore request volume over the last day, week, or month to understand how customers engage with AI flows.
          </p>
        </div>
        <UsageStats />
      </section>
    </div>
  );
}
