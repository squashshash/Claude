"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CAREER_TRACKS, CAREER_TRACK_LABELS, GRADE_LEVELS, GRADE_LEVEL_LABELS, type CareerTrack } from "@/lib/constants";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { MOCK_STUDENT } from "@/lib/mock-data";

function courseTags(text: string): string[] {
  const tags: string[] = [];
  if (/\bAP\b/.test(text)) tags.push("AP");
  if (/\bIB\b/.test(text)) tags.push("IB");
  if (/\bDE\b/.test(text)) tags.push("Dual Enrollment");
  if (/\bHonors\b/i.test(text)) tags.push("Honors");
  return tags;
}

export function ApIbOptimizer() {
  const [track, setTrack] = useState<CareerTrack>(MOCK_STUDENT.targetCareer);
  const template = getRoadmapTemplate(track);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-5">
          <span className="text-sm font-medium text-muted-foreground">Optimize for:</span>
          {CAREER_TRACKS.map((t) => (
            <button
              key={t}
              onClick={() => setTrack(t)}
              className={
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 " +
                (t === track
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70")
              }
            >
              {CAREER_TRACK_LABELS[t]}
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {GRADE_LEVELS.map((grade, i) => {
          const milestone = template.milestones.find(
            (m) => m.gradeLevel === grade && m.category === "academics"
          );
          if (!milestone) return null;
          const tags = courseTags(milestone.title + " " + milestone.description);

          return (
            <motion.div
              key={grade}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card>
                <CardContent className="flex flex-col gap-2 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{GRADE_LEVEL_LABELS[grade]}</Badge>
                    {tags.map((tag) => (
                      <Badge key={tag} variant="accent">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="font-display text-lg font-bold">{milestone.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{milestone.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
