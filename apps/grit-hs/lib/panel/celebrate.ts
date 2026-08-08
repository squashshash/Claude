import { useEffect } from "react";

// Tiny cross-component signal so any card (reminders, hours, …) can trigger
// the drawer's particle burst without prop-drilling a callback down through
// panel-grid.tsx for every section.
const target = new EventTarget();

export function celebrate() {
  target.dispatchEvent(new Event("celebrate"));
}

export function useCelebrationListener(onCelebrate: () => void) {
  useEffect(() => {
    target.addEventListener("celebrate", onCelebrate);
    return () => target.removeEventListener("celebrate", onCelebrate);
  }, [onCelebrate]);
}
