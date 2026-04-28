"use client";

import Logo from "@/assets/logo.svg";
import Shadcncraft from "@/assets/shadcncraft.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/revola";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FIGMA_CONSTANTS, redirectToShadcncraft } from "@/lib/figma-constants";
import { ArrowUpRight, CircleCheck, Figma, Paintbrush, Plug, X } from "lucide-react";
import Link from "next/link";

interface FigmaExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEP_ICONS = [
  <Figma key="figma" className="h-6 w-6" />,
  <Plug key="plug" className="h-6 w-6" />,
  <Paintbrush key="paintbrush" className="h-6 w-6" />,
];

export function FigmaExportDialog({ open, onOpenChange }: FigmaExportDialogProps) {
  const handleBuyNow = () => {
    redirectToShadcncraft();
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="flex max-h-[90%] flex-col overflow-hidden sm:max-h-[min(800px,90dvh)] sm:max-w-200">
        <ScrollArea className="flex h-full flex-col gap-4 overflow-hidden">
          <ResponsiveDialogHeader className="sr-only">
            <ResponsiveDialogTitle>tweakcn × shadcncraft</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Apply your theme to a premium shadcn/ui design system
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          {/* Brand header */}
          <div className="px-8 pt-8 pb-2 sm:pt-8">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <Logo className="h-6 w-6" />
                <div className="text-lg font-bold">tweakcn</div>
              </div>
              <X className="h-4 w-4" />
              <Link href={FIGMA_CONSTANTS.shadcncraftUrl} target="_blank">
                <div className="flex items-center gap-2">
                  <Shadcncraft className="h-6 w-6" />
                  <div className="text-lg font-bold">shadcncraft</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="space-y-16 px-8 pt-8 pb-12">
            {/* Hero */}
            <section className="space-y-6 text-center">
              <div className="space-y-3">
                <h1 className="text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
                  Apply your theme to a premium shadcn/ui design system
                </h1>
                <p className="text-muted-foreground mx-auto max-w-md text-sm">
                  Import this theme using the shadcncraft plugin and update your shadcn/ui kit in
                  seconds.
                </p>
              </div>
              <Button size="lg" className="h-10 px-8" onClick={handleBuyNow}>
                Buy now
              </Button>
              <div className="space-y-2 pt-1">
                <div className="flex justify-center -space-x-3">
                  {FIGMA_CONSTANTS.designers.map((designer, index) => (
                    <Avatar key={index} className="border-background h-8 w-8 border-2">
                      <AvatarImage src={designer.avatar} alt={designer.name} />
                      <AvatarFallback className="text-xs">{designer.fallback}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">
                  Loved by shadcn and 3000+ creators and teams
                </p>
              </div>
              <div className="border-border overflow-hidden rounded-2xl border">
                <img
                  src="/figma-onboarding/hero-dashboard.png"
                  alt="shadcncraft Figma kit preview"
                  className="h-auto w-full"
                />
              </div>
            </section>

            {/* How it works */}
            <section className="space-y-4">
              <h2 className="text-center text-2xl font-medium">How it works</h2>
              <div className="border-border rounded-2xl border px-6">
                <div className="divide-border grid grid-cols-3 divide-x">
                  {FIGMA_CONSTANTS.steps.map((step, index) => (
                    <div
                      key={index}
                      className="space-y-2 px-6 py-6 text-center first:pl-0 last:pr-0"
                    >
                      <div className="text-foreground mb-2 flex justify-center">
                        {STEP_ICONS[index]}
                      </div>
                      <p className="text-muted-foreground text-sm">{step.step}</p>
                      <h3 className="font-medium">{step.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* UI Blocks */}
            <section className="space-y-6 text-center">
              <div className="mx-auto max-w-md space-y-1.5">
                <h2 className="text-2xl leading-tight font-medium">
                  Apply this theme to hundreds of production-ready UI blocks.
                </h2>
                <p className="text-muted-foreground text-sm">
                  Select a frame and generate clean, shadcn-compatible React code with structure,
                  props, and usage examples.
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <Button onClick={handleBuyNow}>Buy now</Button>
                <Link href={FIGMA_CONSTANTS.previewUrl} target="_blank">
                  <Button variant="outline">Preview Blocks</Button>
                </Link>
              </div>
              <div className="border-border overflow-hidden rounded-2xl border">
                <img
                  src="/figma-onboarding/ui-blocks-grid.png"
                  alt="Production-ready UI blocks gallery"
                  className="h-auto w-full"
                />
              </div>
            </section>

            {/* React code */}
            <section className="space-y-6 text-center">
              <div className="mx-auto max-w-md space-y-1.5">
                <h2 className="text-2xl leading-tight font-medium">
                  Generate React code from your Figma designs
                </h2>
                <p className="text-muted-foreground text-sm">
                  Select a frame and generate clean, shadcn-compatible React code with structure,
                  props, and usage examples.
                </p>
              </div>
              <Link
                href={FIGMA_CONSTANTS.previewUrl}
                target="_blank"
                className="inline-block"
              >
                <Button variant="outline" className="gap-1.5">
                  Preview
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="border-border overflow-hidden rounded-2xl border">
                <img
                  src="/figma-onboarding/react-code-preview.png"
                  alt="React code generated from a Figma frame"
                  className="h-auto w-full"
                />
              </div>
            </section>

            {/* Pricing */}
            <Card className="p-8">
              <div className="grid gap-8 md:grid-cols-[3fr_2fr]">
                <div className="space-y-5">
                  <h3 className="text-2xl leading-tight font-medium">
                    What you get with shadcncraft
                  </h3>
                  <ul className="space-y-2.5">
                    {FIGMA_CONSTANTS.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm">
                        <CircleCheck
                          className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0"
                          strokeWidth={1.5}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4 md:items-end">
                  <div className="space-y-1 md:text-right">
                    <p className="text-muted-foreground text-sm">Lifetime access, starting at</p>
                    <div className="text-5xl font-medium tracking-tight">$119</div>
                  </div>
                  <div className="flex w-full flex-col gap-2.5">
                    <Button className="w-full gap-1.5" onClick={handleBuyNow}>
                      Buy now
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Link href={FIGMA_CONSTANTS.shadcncraftUrl} target="_blank" className="block">
                      <Button variant="outline" className="w-full gap-1.5">
                        Start for free
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <p className="text-muted-foreground text-xs md:text-right">
                    One-time payment. Plus local taxes
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
