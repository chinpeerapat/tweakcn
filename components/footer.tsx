import Link from "next/link";
import Logo from "@/assets/logo.svg";

import { ProtectedLink } from "@/components/protected-link";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur">
      <div className="container mx-auto flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="size-6" />
              <span>Tweak AI</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Launch faster with a production-ready AI SaaS starter. Authentication, billing, usage metering, and an AI copilot
              come configured out of the box.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/ai" className="hover:text-foreground transition-colors">
                  AI Studio
                </Link>
              </li>
              <li>
                <ProtectedLink
                  href="/dashboard"
                  requireAuth
                  className="hover:text-foreground transition-colors"
                >
                  Usage Dashboard
                </ProtectedLink>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@tweakai.dev"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Tweak AI. All rights reserved.</p>
          <p className="text-xs">Built for founders shipping AI-first products.</p>
        </div>
      </div>
    </footer>
  );
}
