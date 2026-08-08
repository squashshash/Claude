"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { PanelGrid, type PanelSection } from "@/components/panel/panel-grid";
import { WebglBackground } from "@/components/panel/webgl-background";
import { CelebrationParticles } from "@/components/panel/celebration-particles";
import { bangers } from "@/app/fonts";
import { cn } from "@/lib/utils";

interface RightDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSection: PanelSection | null;
}

export function RightDrawer({ open, onOpenChange, initialSection }: RightDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount onOpenAutoFocus={(e) => e.preventDefault()}>
              <motion.div
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-panel-border/50 bg-panel/95 text-panel-foreground shadow-[inset_1px_0_0_0_hsl(var(--panel-highlight)/0.15),-16px_0_44px_-8px_rgba(0,0,0,0.7)] backdrop-blur-2xl backdrop-saturate-200 md:max-w-lg"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
              >
                <WebglBackground effects />
                <CelebrationParticles />
                <div className="flex items-center justify-between border-b border-panel-border/30 px-6 py-5">
                  <Dialog.Title className={cn(bangers.className, "text-2xl uppercase tracking-wide text-panel-foreground")}>
                    Life Panel
                  </Dialog.Title>
                  <Dialog.Close className="rounded-full p-2 text-panel-muted transition-colors hover:bg-panel-card hover:text-panel-foreground">
                    <X className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Close</span>
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">
                  Clubs, sports, exam deadlines, class schedule, assignment reminders, and volunteer hours.
                </Dialog.Description>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <PanelGrid initialSection={initialSection} />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
