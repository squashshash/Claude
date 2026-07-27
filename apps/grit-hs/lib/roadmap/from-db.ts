import type { Database } from "@/types/database.types";
import type { MilestoneTemplate } from "@/types/roadmap";
import type { MilestoneStatus } from "@/lib/constants";

type MilestoneRow = Database["public"]["Tables"]["milestones"]["Row"];

export interface DbMilestone extends MilestoneTemplate {
  id: string;
  status: MilestoneStatus;
}

/** Maps a real `milestones` row (snake_case DB columns) to the shape the UI components already render. */
export function milestoneFromDb(row: MilestoneRow): DbMilestone {
  return {
    id: row.id,
    gradeLevel: row.grade_level,
    category: row.category,
    title: row.title,
    description: row.description ?? "",
    agePrerequisite: row.age_prerequisite ?? undefined,
    status: row.status,
  };
}
