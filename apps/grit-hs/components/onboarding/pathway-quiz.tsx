"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PathwayCategorySlug } from "@/lib/constants";

interface QuizOption {
  label: string;
  categories: PathwayCategorySlug[];
}

interface QuizQuestion {
  prompt: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    prompt: "On a free Saturday, you'd rather...",
    options: [
      { label: "Fix or build something with your hands", categories: ["trades_vocational"] },
      { label: "Read about a new scientific discovery", categories: ["science_research"] },
      { label: "Organize an event or manage a budget", categories: ["business_finance"] },
      { label: "Sketch, write, or make music", categories: ["creative_arts_design"] },
      { label: "Volunteer or help someone directly", categories: ["medicine_allied_health", "education"] },
    ],
  },
  {
    prompt: "Which subject do you actually enjoy in school?",
    options: [
      { label: "Biology or Chemistry", categories: ["medicine_allied_health"] },
      { label: "Physics or Computer Science", categories: ["engineering_technology"] },
      { label: "History or Government", categories: ["law_government_public_service"] },
      { label: "Art or Music", categories: ["creative_arts_design"] },
      { label: "Environmental Science", categories: ["agriculture_environment"] },
    ],
  },
  {
    prompt: "What kind of impact do you want your work to have?",
    options: [
      { label: "Directly improve people's health", categories: ["medicine_allied_health"] },
      { label: "Keep the world running — power, transit, infrastructure", categories: ["transportation_logistics", "trades_vocational"] },
      { label: "Build or design something people use every day", categories: ["engineering_technology", "creative_arts_design"] },
      { label: "Shape decisions, laws, or policy", categories: ["law_government_public_service"] },
      { label: "Teach or mentor the next generation", categories: ["education"] },
    ],
  },
  {
    prompt: "Pick a work environment that sounds right:",
    options: [
      { label: "Outdoors, with plants, animals, or land", categories: ["agriculture_environment"] },
      { label: "A lab or research setting", categories: ["science_research"] },
      { label: "An office running a business", categories: ["business_finance"] },
      { label: "A classroom or school", categories: ["education"] },
      { label: "A workshop, garage, or job site", categories: ["trades_vocational"] },
    ],
  },
];

export function PathwayQuiz({ onComplete }: { onComplete: (topCategory: PathwayCategorySlug) => void }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Partial<Record<PathwayCategorySlug, number>>>({});

  function pick(option: QuizOption) {
    const next = { ...scores };
    for (const category of option.categories) {
      next[category] = (next[category] ?? 0) + 1 / option.categories.length;
    }
    setScores(next);

    if (step === QUESTIONS.length - 1) {
      const top = Object.entries(next).sort((a, b) => b[1] - a[1])[0]?.[0] as
        | PathwayCategorySlug
        | undefined;
      onComplete(top ?? "engineering_technology");
    } else {
      setStep(step + 1);
    }
  }

  const question = QUESTIONS[step];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1.5">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-muted")}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-3"
        >
          <p className="font-display text-lg font-bold">{question.prompt}</p>
          <div className="flex flex-col gap-2">
            {question.options.map((option) => (
              <button key={option.label} type="button" onClick={() => pick(option)} className="text-left">
                <Card className="transition-colors hover:border-primary">
                  <CardContent className="p-3.5 text-sm font-medium">{option.label}</CardContent>
                </Card>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      {step > 0 && (
        <Button type="button" variant="outline" size="sm" onClick={() => setStep(step - 1)} className="self-start">
          Back
        </Button>
      )}
    </div>
  );
}
