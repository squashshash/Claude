"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PATHWAY_CATEGORIES,
  CAREER_TRACK_LABELS,
  getPathwayCategoryForTrack,
  type CareerTrack,
  type PathwayCategorySlug,
} from "@/lib/constants";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { PathwayQuiz } from "./pathway-quiz";

export function CareerTrackStep({
  value,
  onChange,
}: {
  value: CareerTrack | undefined;
  onChange: (track: CareerTrack) => void;
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [recommended, setRecommended] = useState<PathwayCategorySlug | null>(null);
  const [openCategory, setOpenCategory] = useState<PathwayCategorySlug | null>(
    value ? (getPathwayCategoryForTrack(value)?.slug ?? null) : null
  );

  if (showQuiz) {
    return (
      <PathwayQuiz
        onComplete={(topCategory) => {
          setRecommended(topCategory);
          setOpenCategory(topCategory);
          setShowQuiz(false);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Button type="button" variant="outline" size="sm" onClick={() => setShowQuiz(true)} className="self-start gap-1.5">
        <Sparkles className="size-4" aria-hidden="true" />
        Not sure? Take the 4-question pathway quiz
      </Button>

      <div className="flex flex-col gap-2">
        {PATHWAY_CATEGORIES.map((category) => {
          const open = openCategory === category.slug;
          const isRecommended = recommended === category.slug;
          return (
            <div
              key={category.slug}
              className={cn(
                "overflow-hidden rounded-lg border transition-colors",
                isRecommended ? "border-primary" : "border-border"
              )}
            >
              <button
                type="button"
                onClick={() => setOpenCategory(open ? null : category.slug)}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
              >
                <span className="flex items-center gap-2 font-display text-sm font-bold">
                  {category.label}
                  {isRecommended && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-wide text-primary-foreground">
                      Recommended
                    </span>
                  )}
                </span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="size-4 shrink-0" />
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
                    <div className="grid gap-2 p-3 pt-0 sm:grid-cols-2">
                      {category.tracks.map((track) => {
                        const selected = value === track;
                        return (
                          <button key={track} type="button" onClick={() => onChange(track)} className="text-left">
                            <Card className={cn("h-full transition-colors", selected ? "border-primary ring-2 ring-primary" : undefined)}>
                              <CardContent className="flex flex-col gap-1 p-3.5">
                                <p className="text-sm font-bold">{CAREER_TRACK_LABELS[track]}</p>
                                <p className="line-clamp-2 text-xs text-muted-foreground">
                                  {getRoadmapTemplate(track).summary}
                                </p>
                              </CardContent>
                            </Card>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
