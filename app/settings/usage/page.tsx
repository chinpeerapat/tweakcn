import { UsageStats } from "@/app/settings/components/usage-stats";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsHeader } from "../components/settings-header";

export default async function UsagePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Usage analytics"
        description="Track request volume across the last day, week, or month to understand adoption."
      />
      <UsageStats />
    </div>
  );
}
