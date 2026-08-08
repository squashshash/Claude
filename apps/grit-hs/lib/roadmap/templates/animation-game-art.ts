import type { CareerTrackTemplate } from "@/types/roadmap";

export const animationGameArt: CareerTrackTemplate = {
  track: "animation_game_art",
  label: "Animation & Game Art",
  summary:
    "Animators and game artists create animations or game art — a B.A. in Animation or Game Design. This track pairs AP Computer Science (for the coding side) with real, named portfolio platforms (ArtStation, GitHub) and tools (Blender, Unity).",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Art classes begin",
      description: "Foundational Art coursework, building toward digital-art skill.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join a Game Development Club",
      description: "A school Game Development Club is the named, real entry point for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "AP Computer Science, for game-engine coding",
      description: "AP Computer Science is named specifically for building the coding skill game engines require.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Hackathons; local art contests",
      description: "Both are named, real, accessible competition entry points for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Learn Blender and Unity",
      description: "Blender (3D animation) and Unity (game engine) are the named, real, industry-standard tools for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Create animations/games and post portfolios on ArtStation or GitHub",
      description: "A published portfolio on ArtStation or GitHub — real animation or game projects, not just concept art — is the strongest application item for this track.",
    },
  ],
};
