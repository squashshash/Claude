"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, LayoutGrid, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURE_CATEGORIES } from "@/lib/features/registry";

const PINNED_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/roadmap", label: "4-Year Roadmap", icon: Compass },
];

const STATUS_DOT: Record<string, string> = {
  live: "bg-primary",
  mock: "bg-accent",
  planned: "bg-locked-foreground/40",
};

export function Sidebar() {
  const pathname = usePathname();
  const [openCategory, setOpenCategory] = useState<string | null>(
    FEATURE_CATEGORIES.find((c) => c.features.some((f) => pathname?.includes(f.slug)))?.slug ?? null
  );

  return (
    <aside className="relative z-10 hidden w-72 shrink-0 flex-col border-r border-glass-border/50 bg-card/35 shadow-[inset_-1px_0_0_0_hsl(var(--glass-highlight)/0.15)] backdrop-blur-2xl backdrop-saturate-150 md:flex print:hidden">
      <div className="flex h-20 items-center gap-2 border-b border-glass-border/30 px-6">
        <span className="bg-gradient-to-br from-primary to-accent bg-clip-text font-display text-2xl font-bold tracking-tight text-transparent">
          Grit
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {PINNED_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
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

        <div className="my-2 border-t border-glass-border/30" />

        {FEATURE_CATEGORIES.map((category) => {
          const open = openCategory === category.slug;
          return (
            <div key={category.slug}>
              <button
                onClick={() => setOpenCategory(open ? null : category.slug)}
                className="flex w-full items-center justify-between gap-2 rounded-full px-4 py-2 text-left text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>{category.title}</span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-4 w-4 shrink-0" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-0.5 py-1 pl-2">
                      {category.features.map((feature) => {
                        const href = `/features/${feature.slug}`;
                        const active = pathname === href;
                        return (
                          <Link
                            key={feature.slug}
                            href={href}
                            className={cn(
                              "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-200 hover:translate-x-0.5",
                              active
                                ? "bg-muted font-semibold text-foreground"
                                : "text-foreground/70 hover:bg-muted/60 hover:text-foreground"
                            )}
                          >
                            <span
                              className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT[feature.status])}
                              aria-hidden="true"
                            />
                            <span className="truncate">{feature.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-glass-border/30 p-3">
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
