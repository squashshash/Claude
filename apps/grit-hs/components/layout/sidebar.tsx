"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  LayoutGrid,
  Settings,
  ChevronDown,
  GraduationCap,
  Wrench,
  Target,
  Scale,
  Briefcase,
  Car,
  Users,
  FileText,
  Trophy,
  Calculator,
  BookOpen,
  ArrowRightLeft,
  CalendarRange,
  Award,
  Search,
  Stethoscope,
  PenLine,
  BookMarked,
  Gavel,
  ShieldCheck,
  ClipboardList,
  HandCoins,
  Receipt,
  IdCard,
  Bus,
  Mail,
  Sun,
  Globe,
  Lock,
  ListChecks,
  Flame,
  UserRound,
  FileDown,
  Eye,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
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

// One glyph per category, keyed by slug — same pattern as grit-agency's
// Sidebar NAV_ICONS. Presentation-only, not part of the registry data.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  academics: GraduationCap,
  ctech: Wrench,
  college: Target,
  legal: Scale,
  jobs: Briefcase,
  transportation: Car,
  experience: Users,
  portfolio: FileText,
  execution: Trophy,
};

// One glyph per individual feature, keyed by slug.
const FEATURE_ICONS: Record<string, LucideIcon> = {
  "gpa-calculator": Calculator,
  "ap-ib-optimizer": BookOpen,
  "dual-enrollment-predictor": ArrowRightLeft,
  "four-year-planner": CalendarRange,
  "p-tech-tracker": Award,
  "college-matcher": Search,
  "direct-admit-planner": Stethoscope,
  "essay-deconstructor": PenLine,
  "certification-rulebook": BookMarked,
  "youth-labor-laws": Gavel,
  "liability-hub": ShieldCheck,
  "job-board": ClipboardList,
  "grant-finder": HandCoins,
  "tax-guide": Receipt,
  "license-tracker": IdCard,
  "transit-planner": Bus,
  "ctso-strategy-engine": Trophy,
  "cold-outreach": Mail,
  "summer-programs": Sun,
  "resume-builder": FileText,
  "public-handle": Globe,
  "credential-vault": Lock,
  "weekly-tasks": ListChecks,
  "streak-score": Flame,
  "mentor-matcher": UserRound,
  "counselor-export": FileDown,
  "parent-dashboard": Eye,
  "track-leaderboard": BarChart3,
};

/**
 * The actual nav — logo, pinned links, category accordion, settings — shared
 * between the always-visible desktop <aside> and the mobile slide-in sheet
 * (MobileSidebar) so the 29-feature registry only has one render path.
 * `onNavigate` lets the mobile sheet close itself when a link is tapped.
 */
export function SidebarNavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [openCategory, setOpenCategory] = useState<string | null>(
    FEATURE_CATEGORIES.find((c) => c.features.some((f) => pathname?.includes(f.slug)))?.slug ?? null
  );

  return (
    <>
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
              onClick={onNavigate}
              className={cn(
                "font-interface flex items-center gap-3 rounded-full px-4 py-2.5 text-base transition-all duration-200 hover:translate-x-0.5",
                active
                  ? "bg-primary font-bold text-primary-foreground shadow-sm"
                  : "font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
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
          const CategoryIcon = CATEGORY_ICONS[category.slug] ?? LayoutGrid;
          return (
            <div key={category.slug}>
              <button
                onClick={() => setOpenCategory(open ? null : category.slug)}
                className="font-interface flex w-full items-center justify-between gap-2 rounded-full px-4 py-2 text-left text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <CategoryIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {category.title}
                </span>
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
                        const FeatureIcon = FEATURE_ICONS[feature.slug] ?? Compass;
                        return (
                          <Link
                            key={feature.slug}
                            href={href}
                            onClick={onNavigate}
                            className={cn(
                              "font-interface flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-200 hover:translate-x-0.5",
                              active
                                ? "bg-muted font-bold text-foreground"
                                : "font-light text-foreground/70 hover:bg-muted/60 hover:text-foreground"
                            )}
                          >
                            <FeatureIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
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
          onClick={onNavigate}
          className="font-interface flex items-center gap-3 rounded-full px-4 py-2.5 text-base font-medium text-foreground/80 transition-all duration-200 hover:translate-x-0.5 hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
          Settings
        </Link>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="relative z-10 hidden w-72 shrink-0 flex-col border-r border-glass-border/60 bg-card/18 shadow-[inset_-1px_0_0_0_hsl(var(--glass-highlight)/0.2)] backdrop-blur-2xl backdrop-saturate-200 md:flex print:hidden">
      <SidebarNavContent />
    </aside>
  );
}
