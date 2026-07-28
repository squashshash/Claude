"use client";

import { useMemo, useState } from "react";
import { FileText, Info, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { deriveMilestoneStatus } from "@/lib/roadmap/derive-status";
import { milestoneFromDb } from "@/lib/roadmap/from-db";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";

interface PromptChunk {
  question: string;
  evidence: string | null;
}

const SAMPLE_PROMPT =
  "Describe a challenge you faced and how you overcame it. What did you learn about yourself, and how will it shape your approach to your intended field of study? (250 words)";

function splitPrompt(raw: string): { chunks: string[]; wordTarget: number | null } {
  const wordMatch = raw.match(/(\d{2,4})\s*words?/i);
  const wordTarget = wordMatch ? Number(wordMatch[1]) : null;

  const withoutWordCount = raw.replace(/\(?\s*\d{2,4}\s*words?\)?\.?/i, "").trim();
  const chunks = withoutWordCount
    .split(/(?<=[.?!])\s+|\s+(?=and\s+how\b|and\s+why\b)/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

  return { chunks, wordTarget };
}

export function EssayDeconstructor() {
  const { data } = useDashboardData();
  const isReal = Boolean(data?.authenticated && data.profile && data.roadmap);
  const [prompt, setPrompt] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const completedMilestones = useMemo(() => {
    if (isReal) return data!.milestones!.map(milestoneFromDb).filter((m) => m.status === "completed");
    return getRoadmapTemplate(MOCK_STUDENT.targetCareer).milestones.filter(
      (m) =>
        deriveMilestoneStatus(m, MOCK_STUDENT.currentGrade, MOCK_STUDENT.age, MOCK_STUDENT.state) ===
        "completed"
    );
  }, [isReal, data]);

  const result = useMemo<{ chunks: PromptChunk[]; wordTarget: number | null } | null>(() => {
    if (!submitted) return null;
    const { chunks, wordTarget } = splitPrompt(submitted);
    const perChunk = chunks.map((question, i) => ({
      question,
      evidence: completedMilestones.length ? completedMilestones[i % completedMilestones.length].title : null,
    }));
    return { chunks: perChunk, wordTarget };
  }, [submitted, completedMilestones]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          Paste any supplemental essay prompt below. This splits it into its separate questions and a
          word-count target if one is mentioned, then pairs each question with one of your own completed
          milestones as a starting point — it doesn&apos;t write the essay for you.
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-muted-foreground">Essay prompt</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder={SAMPLE_PROMPT}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="w-fit gap-2"
              onClick={() => setSubmitted(prompt.trim() || SAMPLE_PROMPT)}
            >
              <Sparkles className="h-3.5 w-3.5" /> Break it down
            </Button>
            <Badge variant={isReal ? "default" : "locked"}>
              {isReal ? "Your milestones" : "Sample milestones"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-5">
            {result.wordTarget && (
              <p className="text-sm text-muted-foreground">
                Target length: <span className="font-semibold text-foreground">{result.wordTarget} words</span>
              </p>
            )}
            {result.chunks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Couldn&apos;t find a question in that text.</p>
            ) : (
              result.chunks.map((chunk, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-glass-border/20 bg-background/30 p-4">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="font-display font-bold">{chunk.question}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {chunk.evidence
                        ? `Starting point: your "${chunk.evidence}" milestone.`
                        : "No completed milestones yet to suggest as evidence."}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
