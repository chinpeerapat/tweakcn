"use client";

import Logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProtectedLink } from "@/components/protected-link";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { GetProCTA } from "./get-pro-cta";
import { UserProfileDropdown } from "./user-profile-dropdown";

const navigationLinks = [
  { href: "/#features", label: "Features" },
  { href: "/ai", label: "AI Studio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard", requiresAuth: true },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <Logo className="size-6" />
            <span className="hidden sm:inline">Tweak AI</span>
          </Link>
          <nav aria-label="Main" className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            {navigationLinks.map((link) => (
              <ProtectedLink
                key={link.href}
                href={link.href}
                requireAuth={link.requiresAuth}
                aria-current={pathname === link.href ? "page" : undefined}
                className={
                  pathname === link.href
                    ? "text-foreground"
                    : "hover:text-foreground transition-colors"
                }
              >
                {link.label}
              </ProtectedLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle variant="ghost" size="icon" />
          <GetProCTA className="hidden md:inline-flex" />
          <Button asChild variant="outline" size="sm" className="md:hidden">
            <Link href="/pricing">Upgrade</Link>
          </Button>
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}
