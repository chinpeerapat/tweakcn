import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-[90svh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-muted-foreground mb-3 text-6xl font-extrabold">404</div>
        <h1 className="text-foreground mb-2 text-2xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">Let’s get you back on track.</p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/starter">Go to Starter</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
