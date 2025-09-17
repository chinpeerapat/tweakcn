import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerPortalLink } from "../components/customer-portal-link";
import { PlanSummaryCard } from "../components/plan-summary-card";
import { UserInfo } from "../components/user-info";

export default function AccountSettingsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="text-muted-foreground text-sm">
          Manage your profile details, plan, and billing preferences.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
          <CardDescription>Your information is used to personalize workspace activity and billing receipts.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <UserInfo />
        </CardContent>
      </Card>

      <PlanSummaryCard />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Billing portal</CardTitle>
          <CardDescription>Download invoices, update payment methods, or cancel your subscription.</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerPortalLink />
        </CardContent>
      </Card>
    </div>
  );
}
