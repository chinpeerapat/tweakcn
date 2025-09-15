"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetProDialogStore } from "@/store/get-pro-dialog-store";
import { PRO_SUB_FEATURES } from "@/utils/subscription";
import { Calendar, Check } from "lucide-react";
import Link from "next/link";

import { NoiseEffect } from "./effects/noise-effect";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "./ui/revola";

export function GetProDialogWrapper() {
  const { isOpen, closeGetProDialog } = useGetProDialogStore();

  return <GetProDialog isOpen={isOpen} onClose={closeGetProDialog} />;
}

interface GetProDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GetProDialog({ isOpen, onClose }: GetProDialogProps) {
  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onClose}>
      <ResponsiveDialogContent
        closeButtonClassName="backdrop-blur-md bg-muted/15"
        className="gap-0 overflow-hidden sm:max-w-lg md:w-[calc(100vw-2rem)] md:max-w-4xl"
      >
        <div className="flex flex-col md:flex-row">
          <section className="w-full space-y-8 border-r md:w-1/2">
            <ResponsiveDialogHeader className="sm:p-6 sm:pb-0">
              <ResponsiveDialogTitle>Upgrade to Pro</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                Unlock an AI stack with unlimited responses, shared chat history, and exportable analytics.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>

            <div className="space-y-6 px-6">
              <ul className="space-y-3">
                {PRO_SUB_FEATURES.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-full p-1",
                        feature.status === "done" ? "bg-primary/15" : "bg-muted"
                      )}
                    >
                      {feature.status === "done" ? (
                        <Check className="text-primary size-3 stroke-2" />
                      ) : (
                        <Calendar className="text-muted-foreground size-3 stroke-2" />
                      )}
                    </div>
                    <span className={cn("text-sm", feature.status === "done" ? "" : "opacity-60")}>{feature.description}</span>
                  </li>
                ))}
              </ul>

              <p className="text-muted-foreground text-sm">
                Stay focused on shipping — we handle auth, billing, metering, and AI orchestration so your team can iterate
                faster.
              </p>
            </div>

            <ResponsiveDialogFooter className="bg-muted/30 relative flex-col border-t p-6">
              <Button asChild className="grow">
                <Link href="/pricing" onNavigate={onClose}>
                  View Plans
                </Link>
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Maybe Later
              </Button>
            </ResponsiveDialogFooter>
          </section>

          <section className="bg-muted/30 relative isolate hidden shrink-0 items-center justify-center overflow-hidden md:flex md:w-1/2">
            <div
              className={cn(
                "absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(from_var(--primary)_r_g_b_/_0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(from_var(--primary)_r_g_b_/_0.15)_1px,transparent_1px)] bg-[size:2rem_2rem]",
                "mask-r-from-80% mask-b-from-80% mask-radial-from-70% mask-radial-to-85%"
              )}
            />
            <NoiseEffect />
            <div className="bg-primary/20 absolute right-0 bottom-0 -z-10 size-80 translate-x-1/3 translate-y-1/3 rounded-full blur-3xl" />
            <div className="bg-foreground/10 absolute top-0 left-0 -z-10 size-48 -translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl" />

            <div className="relative mx-auto flex max-w-xs flex-col gap-4 rounded-xl border bg-background/80 p-6 text-sm shadow-lg">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Live metrics</p>
                <p className="text-2xl font-semibold">Usage remains in the green</p>
              </div>
              <div className="space-y-2">
                <Metric label="AI responses today" value="126" trend="▲ 18%" />
                <Metric label="Teams collaborating" value="12" trend="▲ 3 new" />
                <Metric label="Invoices settled" value="$4.2k" trend="▲ on track" />
              </div>
            </div>
          </section>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

function Metric({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/80 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-lg font-semibold">{value}</span>
        <span className="text-xs text-emerald-500">{trend}</span>
      </div>
    </div>
  );
}
