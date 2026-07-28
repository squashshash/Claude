import Link from "next/link";
import { AmbientGlow } from "@/components/layout/ambient-glow";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden bg-background px-4 py-12">
      <AmbientGlow />
      <Link
        href="/"
        className="relative z-10 bg-gradient-to-br from-primary to-accent bg-clip-text font-display text-2xl font-bold tracking-tight text-transparent"
      >
        Grit
      </Link>
      <div className="relative z-10 flex flex-col items-center gap-8">{children}</div>
    </div>
  );
}
