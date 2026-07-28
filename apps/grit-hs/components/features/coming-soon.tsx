"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FeatureDef } from "@/lib/features/registry";

export function ComingSoon({ feature }: { feature: FeatureDef }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground"
        >
          <Rocket className="h-7 w-7" aria-hidden="true" />
        </motion.div>
        <div>
          <Badge variant="locked" className="mb-3">
            #{feature.number} &middot; Queued for a future build
          </Badge>
          <h2 className="font-display text-2xl font-bold">{feature.title}</h2>
          <p className="mx-auto mt-2 max-w-md text-base text-muted-foreground">{feature.blurb}</p>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          This one&apos;s on the roadmap but not wired up yet — no fake data pretending
          otherwise. Ask for it by name and it jumps the queue.
        </p>
      </CardContent>
    </Card>
  );
}
