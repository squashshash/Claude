import { Rubik_Mono_One, Sour_Gummy, Bangers } from "next/font/google";

// Display font — blocky/geometric headings only (matches the grit-agency /
// planner sibling projects' look). Body copy stays on --font-sans (Inter),
// unchanged, since this app has dense dashboard/form content where a
// display face would hurt readability at paragraph length.
export const rubikMonoOne = Rubik_Mono_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rubik-mono",
  display: "swap",
});

// Interface font — nav/sidebar labels only, matching grit-agency's Sidebar.
// 700 for active items, 500/300 for inactive — not used for body copy.
export const sourGummy = Sour_Gummy({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--font-sour-gummy",
  display: "swap",
});

// Comic-lettering display face — the free/OFL-licensed "Marvel-ish" look
// (real Marvel/Blambot lettering fonts require a paid commercial license;
// this is the closest open equivalent, same substitution grit-agency made
// for the same ask). Used only for CardTitle — the small in-card section
// headers, not page titles or body copy — via .className directly rather
// than a global --font-* token, so it stays scoped to that one component.
export const bangers = Bangers({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
