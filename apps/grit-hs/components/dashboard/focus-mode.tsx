"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export interface NextUpItem {
  title: string;
  description: string;
  category: string;
}

export function FocusModeToggle({
  overallPct,
  xp,
  completed,
  total,
  nextUp,
}: {
  overallPct: number;
  xp: number;
  completed: number;
  total: number;
  nextUp: NextUpItem[];
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant={focused ? "default" : "outline"}
          className="gap-2"
          onClick={() => setFocused((f) => !f)}
        >
          <Target className="h-4 w-4" />
          {focused ? "Exit focus mode" : "Focus mode"}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {focused ? (
          <motion.div
            key="focused"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardDescription className="text-base">Just the next 2 — nothing else</CardDescription>
                <CardTitle className="text-2xl">What&apos;s next</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {nextUp.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nothing queued — every milestone available to you right now is done.
                  </p>
                ) : (
                  nextUp.map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3 rounded-lg border border-glass-border/15 bg-background/30 p-4"
                    >
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                      <div>
                        <p className="font-display font-bold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid gap-5 sm:grid-cols-3"
          >
            <Card>
              <CardHeader>
                <CardDescription className="text-base">Overall roadmap progress</CardDescription>
                <CardTitle className="text-3xl">{overallPct}%</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={overallPct} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription className="text-base">XP earned</CardDescription>
                <CardTitle className="text-3xl">{xp.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription className="text-base">Milestones completed</CardDescription>
                <CardTitle className="text-3xl">
                  {completed} / {total}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
