"use client";

import Link, { type LinkProps } from "next/link";
import {
  forwardRef,
  type MouseEvent,
  type ReactNode,
  type AnchorHTMLAttributes,
} from "react";

import { useRequireAuthRedirect } from "@/hooks/use-require-auth-redirect";

interface ProtectedLinkProps
  extends LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  mode?: "signin" | "signup";
}

export const ProtectedLink = forwardRef<HTMLAnchorElement, ProtectedLinkProps>(
  (
    {
      children,
      requireAuth = false,
      redirectTo,
      mode = "signin",
      onClick,
      href,
      ...props
    },
    ref
  ) => {
    const defaultRedirect =
      redirectTo ?? (typeof href === "string" ? href : "/dashboard");
    const requireAuthRedirect = useRequireAuthRedirect(defaultRedirect);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (requireAuth) {
        const canNavigate = requireAuthRedirect(event, {
          redirectTo: redirectTo ?? defaultRedirect,
          mode,
        });

        if (!canNavigate) {
          return;
        }
      }

      onClick?.(event);
    };

    return (
      <Link ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  }
);

ProtectedLink.displayName = "ProtectedLink";
