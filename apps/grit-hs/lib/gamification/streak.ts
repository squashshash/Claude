/**
 * Pure streak logic — no I/O, easy to unit-test and safe to run both
 * server-side (API route) and client-side (optimistic preview).
 *
 * Deliberately non-punitive per the psych research: missing exactly one
 * day doesn't zero a real streak out if a "grace" is available (spent
 * automatically, no prompt, no shame), and a grace regenerates every 7
 * consecutive days back in good standing. Missing 2+ days without a grace
 * starts a fresh streak at 1, not 0 — today's check-in always counts.
 */

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  graceAvailable: boolean;
}

export interface StreakUpdateResult extends StreakState {
  alreadyCheckedInToday: boolean;
  graceUsed: boolean;
  graceRegenerated: boolean;
}

function daysBetween(fromISODate: string, toISODate: string): number {
  const from = new Date(fromISODate + "T00:00:00Z").getTime();
  const to = new Date(toISODate + "T00:00:00Z").getTime();
  return Math.round((to - from) / (1000 * 60 * 60 * 24));
}

const GRACE_REGENERATION_INTERVAL = 7;

export function checkIn(state: StreakState, todayISODate: string): StreakUpdateResult {
  if (state.lastActiveDate === todayISODate) {
    return { ...state, alreadyCheckedInToday: true, graceUsed: false, graceRegenerated: false };
  }

  const gap = state.lastActiveDate ? daysBetween(state.lastActiveDate, todayISODate) : null;

  let nextStreak: number;
  let graceUsed = false;
  let graceAvailable = state.graceAvailable;

  if (gap === null || gap > 2) {
    // First-ever check-in, or too large a gap to bridge — fresh streak.
    nextStreak = 1;
  } else if (gap === 1) {
    nextStreak = state.currentStreak + 1;
  } else {
    // gap === 2: exactly one missed day.
    if (state.graceAvailable) {
      nextStreak = state.currentStreak + 1;
      graceUsed = true;
      graceAvailable = false;
    } else {
      nextStreak = 1;
    }
  }

  let graceRegenerated = false;
  if (!graceAvailable && nextStreak > 0 && nextStreak % GRACE_REGENERATION_INTERVAL === 0) {
    graceAvailable = true;
    graceRegenerated = true;
  }

  return {
    currentStreak: nextStreak,
    longestStreak: Math.max(state.longestStreak, nextStreak),
    lastActiveDate: todayISODate,
    graceAvailable,
    alreadyCheckedInToday: false,
    graceUsed,
    graceRegenerated,
  };
}

/** Always gain-framed per the psych research — never "you'll lose your streak." */
export function streakMessage(result: StreakUpdateResult): string {
  if (result.alreadyCheckedInToday) return "Already checked in today — nice, come back tomorrow.";
  if (result.graceRegenerated) return `${result.currentStreak}-day streak — and you've earned a new streak freeze.`;
  if (result.graceUsed) return `${result.currentStreak}-day streak — a streak freeze covered yesterday, so nothing was lost.`;
  if (result.currentStreak === 1) return "Streak started — show up again tomorrow to build it.";
  return `${result.currentStreak}-day streak. Keep it going.`;
}
