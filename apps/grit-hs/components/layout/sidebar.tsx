"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutGrid,
  ShieldCheck,
  Mail,
  Clock,
  Trophy,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/roadmap", label: "4-Year Roadmap", icon: Compass },
  { href: "/certifications", label: "Certifications & Vault", icon: ShieldCheck },
  { href: "/outreach", label: "Cold Outreach", icon: Mail },
  { href: "/hours", label: "Hours Logger", icon: Clock },
  { href: "/ctso", label: "CTSO Matchmaker", icon: Trophy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-20 items-center gap-2 border-b border-border px-6">
        <span className="font-display text-2xl font-bold tracking-tight text-primary">
          Grit <span className="text-accent">HS</span>
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1.5 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2.5 text-base font-medium transition-all duration-200 hover:translate-x-0.5",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-full px-4 py-2.5 text-base font-medium text-foreground/80 transition-all duration-200 hover:translate-x-0.5 hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
