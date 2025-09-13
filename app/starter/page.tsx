"use client";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertBanner } from "@/components/alert-banner";
import { StarterChat } from "@/components/starter/chat";

export default function StarterPage() {
  const { data: session } = authClient.useSession();
  const openAuthDialog = useAuthStore((s) => s.openAuthDialog);
  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AI App Starter</h1>
          <p className="text-sm text-muted-foreground">
            Auth, payments, and rate limits — ready to go.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {session.user.name || session.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => authClient.signOut()}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" onClick={() => openAuthDialog("signin")}>
                Sign in
              </Button>
              <Button size="sm" variant="outline" onClick={() => openAuthDialog("signup")}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
      <AlertBanner />

      <StarterChat />

      <div className="mt-10 text-xs text-muted-foreground">
        This page uses <code>/api/ai/chat</code> with streaming when supported.
        Configure <code>AI_PROVIDER</code> and API keys in <code>.env</code>. Check pricing at
        {" "}
        <Link className="text-primary hover:underline" href="/pricing">
          /pricing
        </Link>
        .
      </div>
    </div>
  );
}
