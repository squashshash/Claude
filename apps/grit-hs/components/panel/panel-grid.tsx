"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { bangers } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { ClubsCard } from "./clubs-card";
import { SportsCard } from "./sports-card";
import { ExamsCard } from "./exams-card";
import { ScheduleCard } from "./schedule-card";
import { RemindersCard } from "./reminders-card";
import { HoursCard } from "./hours-card";

export type PanelSection = "clubs" | "sports" | "exams" | "schedule" | "reminders" | "hours";

const SECTION_LABELS: Record<PanelSection, string> = {
  clubs: "Clubs",
  sports: "Sports",
  exams: "Exam Deadlines",
  schedule: "Class Schedule",
  reminders: "Reminders",
  hours: "Volunteer Hours",
};

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
};

interface PanelGridProps {
  initialSection: PanelSection | null;
}

export function PanelGrid({ initialSection }: PanelGridProps) {
  const [activeSection, setActiveSection] = useState<PanelSection | null>(initialSection);

  return (
    <AnimatePresence mode="wait">
      {activeSection ? (
        <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          <button
            type="button"
            onClick={() => setActiveSection(null)}
            className="mb-4 flex items-center gap-1 font-interface text-sm text-panel-muted hover:text-panel-foreground"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back to overview
          </button>
          <h2 className={cn(bangers.className, "mb-4 text-2xl uppercase tracking-wide text-panel-foreground")}>
            {SECTION_LABELS[activeSection]}
          </h2>
          {activeSection === "clubs" && <ClubsCard mode="detail" />}
          {activeSection === "sports" && <SportsCard mode="detail" />}
          {activeSection === "exams" && <ExamsCard mode="detail" />}
          {activeSection === "schedule" && <ScheduleCard mode="detail" />}
          {activeSection === "reminders" && <RemindersCard mode="detail" />}
          {activeSection === "hours" && <HoursCard mode="detail" />}
        </motion.div>
      ) : (
        <motion.div
          key="grid"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <motion.div variants={cardVariants}>
            <ClubsCard mode="summary" onExpand={() => setActiveSection("clubs")} />
          </motion.div>
          <motion.div variants={cardVariants}>
            <SportsCard mode="summary" onExpand={() => setActiveSection("sports")} />
          </motion.div>
          <motion.div variants={cardVariants}>
            <ExamsCard mode="summary" onExpand={() => setActiveSection("exams")} />
          </motion.div>
          <motion.div variants={cardVariants}>
            <ScheduleCard mode="summary" onExpand={() => setActiveSection("schedule")} />
          </motion.div>
          <motion.div variants={cardVariants}>
            <RemindersCard mode="summary" onExpand={() => setActiveSection("reminders")} />
          </motion.div>
          <motion.div variants={cardVariants}>
            <HoursCard mode="summary" onExpand={() => setActiveSection("hours")} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
