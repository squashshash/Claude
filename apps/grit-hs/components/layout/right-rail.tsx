"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Trophy, CalendarClock, CalendarDays, BellRing, Clock, Sparkles, ChevronLeft } from "lucide-react";
import { RightDrawer } from "./right-drawer";
import { WebglBackground } from "@/components/panel/webgl-background";
import type { PanelSection } from "@/components/panel/panel-grid";

const RAIL_ITEMS: { section: PanelSection; label: string; icon: typeof Users }[] = [
  { section: "clubs", label: "Clubs", icon: Users },
  { section: "sports", label: "Sports", icon: Trophy },
  { section: "exams", label: "Exam Deadlines", icon: CalendarClock },
  { section: "schedule", label: "Class Schedule", icon: CalendarDays },
  { section: "reminders", label: "Reminders", icon: BellRing },
  { section: "hours", label: "Volunteer Hours", icon: Clock },
];

export function RightRail() {
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<PanelSection | null>(null);

  function openSection(section: PanelSection) {
    setActiveSection(section);
    setOpen(true);
    setExpanded(false);
  }

  function openOverview() {
    setActiveSection(null);
    setOpen(true);
    setExpanded(false);
  }

  return (
    <>
      {/* Fully collapsed by default — a small pull tab is the only thing on
          screen so it never overlaps the header's XP badge/avatar. Clicking
          it slides the full icon rail out; clicking again (or picking a
          section) collapses it back. Desktop only — below md there's no
          room for a hover-friendly edge rail, so mobile gets a floating
          action button instead (below) that opens the same drawer directly. */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Collapse life panel rail" : "Expand life panel rail"}
        aria-expanded={expanded}
        className="fixed right-0 top-1/2 z-20 hidden -translate-y-1/2 items-center gap-0.5 rounded-l-full border border-r-0 border-panel-border/50 bg-panel/90 py-3 pl-2 pr-1.5 text-panel-muted shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-colors hover:text-panel-highlight md:flex print:hidden"
      >
        <motion.span animate={{ rotate: expanded ? 0 : 180 }} transition={{ duration: 0.2 }}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </button>

      <button
        type="button"
        onClick={openOverview}
        aria-label="Open Life Panel"
        className="fixed bottom-5 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-panel-border/50 bg-panel/95 text-panel-highlight shadow-[0_8px_28px_-6px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform active:scale-95 md:hidden print:hidden"
      >
        <Sparkles className="h-6 w-6" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.aside
            initial={{ x: 56, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 56, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-y-0 right-0 z-10 hidden w-14 flex-col items-center gap-1 overflow-hidden border-l border-panel-border/40 bg-panel/90 py-6 backdrop-blur-2xl backdrop-saturate-200 md:flex print:hidden"
            aria-label="Life panel quick access"
          >
            <WebglBackground effects={false} />
            <Sparkles className="mb-4 h-5 w-5 text-panel-accent" aria-hidden="true" />
            {RAIL_ITEMS.map((item) => (
              <button
                key={item.section}
                type="button"
                onClick={() => openSection(item.section)}
                title={item.label}
                aria-label={item.label}
                className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-interface text-panel-muted transition-colors hover:bg-panel-card hover:text-panel-highlight"
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </button>
            ))}
          </motion.aside>
        )}
      </AnimatePresence>

      <RightDrawer open={open} onOpenChange={setOpen} initialSection={activeSection} />
    </>
  );
}
