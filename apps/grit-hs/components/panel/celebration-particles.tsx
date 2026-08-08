"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { useCelebrationListener } from "@/lib/panel/celebrate";

const CelebrationBurstScene = dynamic(
  () => import("./celebration-burst-scene").then((mod) => mod.CelebrationBurstScene),
  { ssr: false }
);

// Mounted once inside the drawer; listens for celebrate() calls from any
// card (a completed reminder, a logged hours entry) and plays a brief
// particle burst — mounts only while active, no persistent render cost.
export function CelebrationParticles() {
  const [active, setActive] = useState(false);

  const handleCelebrate = useCallback(() => setActive(true), []);
  useCelebrationListener(handleCelebrate);

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center" aria-hidden="true">
      <div className="h-40 w-40">
        <CelebrationBurstScene onDone={() => setActive(false)} />
      </div>
    </div>
  );
}
