import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckoutButton } from "./components/checkout-button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Starter",
  robots: "index, follow",
};

export default function PricingPage() {
  return (
    <div className="relative isolate min-h-screen">
      <div className="container mx-auto space-y-16 px-4 py-16">
        <section className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Choose your plan</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl">Start free. Upgrade to Pro anytime.</p>
        </section>

        <section className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <div className="text-3xl font-bold">$0</div>
              <p className="text-muted-foreground text-sm">No credit card required</p>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>Sign in with OAuth/Email</li>
                <li>Basic AI usage with free quota</li>
                <li>Rate limited</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/starter">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col border-2">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <div className="text-3xl font-bold">$8</div>
              <p className="text-muted-foreground text-sm">Billed monthly • Cancel anytime</p>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>Unlimited AI requests</li>
                <li>Priority support</li>
                <li>More to come…</li>
              </ul>
            </CardContent>
            <CardFooter>
              <CheckoutButton className="w-full" />
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
}

