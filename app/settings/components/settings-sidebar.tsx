"use client";

import { Separator } from "@/components/ui/separator";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { BarChart3, CreditCard, LucideIcon, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type NavItem =
  | {
      type: "link";
      href: string;
      label: string;
      icon?: LucideIcon;
      isExternal?: boolean;
    }
  | {
      type: "separator";
      id: string;
    };

const BASE_NAV_ITEMS: NavItem[] = [
  { type: "link", href: "/settings/account", label: "Account", icon: Shield },
  { type: "link", href: "/settings/usage", label: "Usage", icon: BarChart3 },
];

const getSubscriptionNavItems = (): NavItem[] => [
  { type: "separator", id: "subscription-separator" },
  {
    type: "link",
    href: "/settings/portal",
    label: "Manage Subscription",
    icon: CreditCard,
    isExternal: true,
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const { subscriptionStatus } = useSubscription();

  const navItems = useMemo(() => {
    if (subscriptionStatus?.isSubscribed) {
      return [...BASE_NAV_ITEMS, ...getSubscriptionNavItems()];
    }
    return BASE_NAV_ITEMS;
  }, [subscriptionStatus?.isSubscribed]);

  return (
    <aside className="w-full max-w-xs shrink-0">
      <nav className="space-y-1">
        {navItems.map((item) => {
          if (item.type === "separator") {
            return <Separator key={item.id} className="my-2" />;
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:bg-muted flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive && "bg-muted"
              )}
            >
              {item.icon && <item.icon className="size-4" />}
              {item.label}
              {item.isExternal && <span className="ml-auto text-xs">↗</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
