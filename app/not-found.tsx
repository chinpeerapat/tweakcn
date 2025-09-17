"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm uppercase tracking-wide">404</p>
        <h1 className="text-pretty text-3xl font-semibold sm:text-4xl">This page has drifted into the void</h1>
        <p className="text-muted-foreground max-w-xl text-sm md:text-base">
          The link you followed might be broken or the page may have been removed. Jump back into the app and keep building.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
