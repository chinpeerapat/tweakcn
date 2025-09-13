"use client";

import { AuthDialog } from "@/app/(auth)/components/auth-dialog";
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { executePostLoginAction } from "@/hooks/use-post-login-action";
import { usePostHog } from "posthog-js/react";

export function AuthDialogWrapper() {
  const { isOpen, mode, closeAuthDialog, postLoginAction, clearPostLoginAction } = useAuthStore();
  const { data: session } = authClient.useSession();
  const posthog = usePostHog();

  useEffect(() => {
    if (isOpen && session) {
      closeAuthDialog();
    }

    if (session && session.user && session.user.email) {
      try {
        // Identify user with PostHog when available
        // Guard in case PostHog isn't initialized in the starter
        // @ts-expect-error: PostHog type may be optional in starter
        posthog?.identify?.(session.user.email, {
          name: session.user.name,
          email: session.user.email,
        });
      } catch (_) {}
    }

    if (session && postLoginAction) {
      // Execute action immediately - the system will now handle waiting for handlers
      executePostLoginAction(postLoginAction);
      clearPostLoginAction();
    }
  }, [session, isOpen, closeAuthDialog, postLoginAction, clearPostLoginAction, posthog]);

  return <AuthDialog open={isOpen} onOpenChange={closeAuthDialog} initialMode={mode} />;
}
