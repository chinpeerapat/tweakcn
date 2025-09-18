"use client";

import { SyntheticEvent, useCallback } from "react";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";

interface RequireAuthOptions {
  redirectTo?: string;
  mode?: "signin" | "signup";
}

export function useRequireAuthRedirect(defaultRedirect = "/dashboard") {
  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();
  const isAuthenticated = Boolean(session?.user);

  return useCallback(
    (event?: SyntheticEvent, options?: RequireAuthOptions) => {
      if (isAuthenticated) {
        return true;
      }

      event?.preventDefault?.();
      event?.stopPropagation?.();

      const redirectPath = options?.redirectTo ?? defaultRedirect;
      const mode = options?.mode ?? "signin";

      openAuthDialog(mode, "REDIRECT", { path: redirectPath });
      return false;
    },
    [isAuthenticated, defaultRedirect, openAuthDialog]
  );
}
