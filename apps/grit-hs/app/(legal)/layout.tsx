import Link from "next/link";
import { AmbientGlow } from "@/components/layout/ambient-glow";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background px-4 py-12">
      <AmbientGlow />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-8">
        <Link
          href="/"
          className="bg-gradient-to-br from-primary to-accent bg-clip-text font-display text-2xl font-bold tracking-tight text-transparent"
        >
          Grit
        </Link>
        {children}
        <footer className="flex gap-4 border-t border-glass-border/60 pt-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </footer>
      </div>
    </div>
  );
}
