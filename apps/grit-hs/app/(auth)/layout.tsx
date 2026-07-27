import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <Link href="/" className="font-display text-2xl font-bold tracking-tight text-primary">
        Grit
      </Link>
      {children}
    </div>
  );
}
