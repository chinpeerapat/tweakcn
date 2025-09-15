import { AuthDialogWrapper } from "@/components/auth-dialog-wrapper";
import { Footer } from "@/components/footer";
import { GetProDialogWrapper } from "@/components/get-pro-dialog-wrapper";
import { Header } from "@/components/header";
import { PostHogInit } from "@/components/posthog-init";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/lib/query-client";
import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tweak AI — Ship your AI SaaS faster",
    template: "%s — Tweak AI",
  },
  description:
    "Production-ready boilerplate for AI SaaS apps. Authentication, subscription billing, usage analytics, and an AI copilot are configured from day one.",
  openGraph: {
    title: "Tweak AI — Ship your AI SaaS faster",
    description:
      "Production-ready boilerplate for AI SaaS apps. Authentication, subscription billing, usage analytics, and an AI copilot are configured from day one.",
    url: "https://tweakai.dev",
    siteName: "Tweak AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tweak AI — Ship your AI SaaS faster",
    description:
      "Production-ready boilerplate for AI SaaS apps. Authentication, subscription billing, usage analytics, and an AI copilot are configured from day one.",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>
          <Suspense>
            <QueryProvider>
              <ThemeProvider defaultTheme="dark">
                <TooltipProvider>
                  <AuthDialogWrapper />
                  <GetProDialogWrapper />
                  <Header />
                  <main className="flex min-h-svh flex-col">{children}</main>
                  <Footer />
                  <Toaster />
                </TooltipProvider>
              </ThemeProvider>
            </QueryProvider>
          </Suspense>
        </NuqsAdapter>
        <PostHogInit />
      </body>
    </html>
  );
}
