/**
 * Common US high school courses, for the class-schedule picker.
 *
 * The AP entries are the College Board's official course names. Everything
 * else is a widely-used course title — exact naming and which levels are
 * offered vary by district, so this is an autocomplete to save typing rather
 * than a claim about any school's catalog. Free text stays allowed.
 */
export type CourseSubject =
  | "English"
  | "Mathematics"
  | "Science"
  | "Social Studies"
  | "World Languages"
  | "Arts"
  | "Computer Science"
  | "Health & PE"
  | "Career & Technical";

export type CourseLevel = "Core" | "Honors" | "AP" | "IB" | "Dual Enrollment" | "Elective";

export interface CourseOption {
  name: string;
  subject: CourseSubject;
  level: CourseLevel;
}

const AP_COURSES: { name: string; subject: CourseSubject }[] = [
  { name: "AP English Language and Composition", subject: "English" },
  { name: "AP English Literature and Composition", subject: "English" },
  { name: "AP Seminar", subject: "English" },
  { name: "AP Research", subject: "English" },
  { name: "AP Calculus AB", subject: "Mathematics" },
  { name: "AP Calculus BC", subject: "Mathematics" },
  { name: "AP Statistics", subject: "Mathematics" },
  { name: "AP Precalculus", subject: "Mathematics" },
  { name: "AP Biology", subject: "Science" },
  { name: "AP Chemistry", subject: "Science" },
  { name: "AP Physics 1: Algebra-Based", subject: "Science" },
  { name: "AP Physics 2: Algebra-Based", subject: "Science" },
  { name: "AP Physics C: Mechanics", subject: "Science" },
  { name: "AP Physics C: Electricity and Magnetism", subject: "Science" },
  { name: "AP Environmental Science", subject: "Science" },
  { name: "AP United States History", subject: "Social Studies" },
  { name: "AP World History: Modern", subject: "Social Studies" },
  { name: "AP European History", subject: "Social Studies" },
  { name: "AP United States Government and Politics", subject: "Social Studies" },
  { name: "AP Comparative Government and Politics", subject: "Social Studies" },
  { name: "AP Macroeconomics", subject: "Social Studies" },
  { name: "AP Microeconomics", subject: "Social Studies" },
  { name: "AP Psychology", subject: "Social Studies" },
  { name: "AP Human Geography", subject: "Social Studies" },
  { name: "AP African American Studies", subject: "Social Studies" },
  { name: "AP Spanish Language and Culture", subject: "World Languages" },
  { name: "AP Spanish Literature and Culture", subject: "World Languages" },
  { name: "AP French Language and Culture", subject: "World Languages" },
  { name: "AP German Language and Culture", subject: "World Languages" },
  { name: "AP Italian Language and Culture", subject: "World Languages" },
  { name: "AP Chinese Language and Culture", subject: "World Languages" },
  { name: "AP Japanese Language and Culture", subject: "World Languages" },
  { name: "AP Latin", subject: "World Languages" },
  { name: "AP Art History", subject: "Arts" },
  { name: "AP Music Theory", subject: "Arts" },
  { name: "AP 2-D Art and Design", subject: "Arts" },
  { name: "AP 3-D Art and Design", subject: "Arts" },
  { name: "AP Drawing", subject: "Arts" },
  { name: "AP Computer Science A", subject: "Computer Science" },
  { name: "AP Computer Science Principles", subject: "Computer Science" },
];

const STANDARD_COURSES: CourseOption[] = [
  // English
  { name: "English 9", subject: "English", level: "Core" },
  { name: "English 10", subject: "English", level: "Core" },
  { name: "English 11", subject: "English", level: "Core" },
  { name: "English 12", subject: "English", level: "Core" },
  { name: "Honors English 9", subject: "English", level: "Honors" },
  { name: "Honors English 10", subject: "English", level: "Honors" },
  { name: "Creative Writing", subject: "English", level: "Elective" },
  { name: "Journalism", subject: "English", level: "Elective" },
  { name: "Public Speaking", subject: "English", level: "Elective" },

  // Mathematics
  { name: "Algebra I", subject: "Mathematics", level: "Core" },
  { name: "Geometry", subject: "Mathematics", level: "Core" },
  { name: "Algebra II", subject: "Mathematics", level: "Core" },
  { name: "Precalculus", subject: "Mathematics", level: "Core" },
  { name: "Calculus", subject: "Mathematics", level: "Core" },
  { name: "Statistics", subject: "Mathematics", level: "Core" },
  { name: "Honors Algebra II", subject: "Mathematics", level: "Honors" },
  { name: "Honors Geometry", subject: "Mathematics", level: "Honors" },
  { name: "Honors Precalculus", subject: "Mathematics", level: "Honors" },
  { name: "Multivariable Calculus", subject: "Mathematics", level: "Dual Enrollment" },
  { name: "Linear Algebra", subject: "Mathematics", level: "Dual Enrollment" },
  { name: "Discrete Mathematics", subject: "Mathematics", level: "Elective" },

  // Science
  { name: "Biology", subject: "Science", level: "Core" },
  { name: "Chemistry", subject: "Science", level: "Core" },
  { name: "Physics", subject: "Science", level: "Core" },
  { name: "Earth Science", subject: "Science", level: "Core" },
  { name: "Environmental Science", subject: "Science", level: "Core" },
  { name: "Honors Biology", subject: "Science", level: "Honors" },
  { name: "Honors Chemistry", subject: "Science", level: "Honors" },
  { name: "Honors Physics", subject: "Science", level: "Honors" },
  { name: "Anatomy and Physiology", subject: "Science", level: "Elective" },
  { name: "Medical Terminology", subject: "Science", level: "Elective" },
  { name: "Forensic Science", subject: "Science", level: "Elective" },
  { name: "Astronomy", subject: "Science", level: "Elective" },
  { name: "Marine Biology", subject: "Science", level: "Elective" },
  { name: "Organic Chemistry", subject: "Science", level: "Dual Enrollment" },

  // Social Studies
  { name: "World History", subject: "Social Studies", level: "Core" },
  { name: "United States History", subject: "Social Studies", level: "Core" },
  { name: "United States Government", subject: "Social Studies", level: "Core" },
  { name: "Economics", subject: "Social Studies", level: "Core" },
  { name: "Geography", subject: "Social Studies", level: "Core" },
  { name: "Psychology", subject: "Social Studies", level: "Elective" },
  { name: "Sociology", subject: "Social Studies", level: "Elective" },
  { name: "Civics", subject: "Social Studies", level: "Core" },

  // World Languages
  { name: "Spanish I", subject: "World Languages", level: "Core" },
  { name: "Spanish II", subject: "World Languages", level: "Core" },
  { name: "Spanish III", subject: "World Languages", level: "Core" },
  { name: "Spanish IV", subject: "World Languages", level: "Core" },
  { name: "French I", subject: "World Languages", level: "Core" },
  { name: "French II", subject: "World Languages", level: "Core" },
  { name: "French III", subject: "World Languages", level: "Core" },
  { name: "German I", subject: "World Languages", level: "Core" },
  { name: "German II", subject: "World Languages", level: "Core" },
  { name: "Latin I", subject: "World Languages", level: "Core" },
  { name: "Latin II", subject: "World Languages", level: "Core" },
  { name: "Mandarin Chinese I", subject: "World Languages", level: "Core" },
  { name: "Mandarin Chinese II", subject: "World Languages", level: "Core" },
  { name: "American Sign Language I", subject: "World Languages", level: "Core" },
  { name: "American Sign Language II", subject: "World Languages", level: "Core" },

  // Arts
  { name: "Concert Band", subject: "Arts", level: "Elective" },
  { name: "Jazz Band", subject: "Arts", level: "Elective" },
  { name: "Orchestra", subject: "Arts", level: "Elective" },
  { name: "Chorus", subject: "Arts", level: "Elective" },
  { name: "Music Theory", subject: "Arts", level: "Elective" },
  { name: "Studio Art", subject: "Arts", level: "Elective" },
  { name: "Ceramics", subject: "Arts", level: "Elective" },
  { name: "Photography", subject: "Arts", level: "Elective" },
  { name: "Graphic Design", subject: "Arts", level: "Elective" },
  { name: "Theatre Arts", subject: "Arts", level: "Elective" },
  { name: "Film Production", subject: "Arts", level: "Elective" },
  { name: "Dance", subject: "Arts", level: "Elective" },

  // Computer Science
  { name: "Introduction to Computer Science", subject: "Computer Science", level: "Core" },
  { name: "Computer Programming", subject: "Computer Science", level: "Elective" },
  { name: "Web Development", subject: "Computer Science", level: "Elective" },
  { name: "Cybersecurity", subject: "Computer Science", level: "Elective" },
  { name: "Data Structures", subject: "Computer Science", level: "Dual Enrollment" },
  { name: "Robotics", subject: "Computer Science", level: "Elective" },
  { name: "Game Design", subject: "Computer Science", level: "Elective" },

  // Health & PE
  { name: "Physical Education", subject: "Health & PE", level: "Core" },
  { name: "Health", subject: "Health & PE", level: "Core" },
  { name: "Weight Training", subject: "Health & PE", level: "Elective" },
  { name: "Sports Medicine", subject: "Health & PE", level: "Elective" },

  // Career & Technical
  { name: "Business Management", subject: "Career & Technical", level: "Elective" },
  { name: "Accounting", subject: "Career & Technical", level: "Elective" },
  { name: "Marketing", subject: "Career & Technical", level: "Elective" },
  { name: "Personal Finance", subject: "Career & Technical", level: "Elective" },
  { name: "Engineering Design", subject: "Career & Technical", level: "Elective" },
  { name: "CAD / Drafting", subject: "Career & Technical", level: "Elective" },
  { name: "Automotive Technology", subject: "Career & Technical", level: "Elective" },
  { name: "Construction Technology", subject: "Career & Technical", level: "Elective" },
  { name: "Welding", subject: "Career & Technical", level: "Elective" },
  { name: "Culinary Arts", subject: "Career & Technical", level: "Elective" },
  { name: "Nursing Assistant (CNA) Program", subject: "Career & Technical", level: "Elective" },
  { name: "Early Childhood Education", subject: "Career & Technical", level: "Elective" },
  { name: "Agriculture Science", subject: "Career & Technical", level: "Elective" },
];

export const COURSE_CATALOG: CourseOption[] = [
  ...AP_COURSES.map((c) => ({ ...c, level: "AP" as CourseLevel })),
  ...STANDARD_COURSES,
];

export const COURSE_NAMES = COURSE_CATALOG.map((c) => c.name);

export function searchCourses(query: string, limit = 8): CourseOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const starts: CourseOption[] = [];
  const contains: CourseOption[] = [];
  for (const course of COURSE_CATALOG) {
    const name = course.name.toLowerCase();
    if (name.startsWith(q)) starts.push(course);
    else if (name.includes(q)) contains.push(course);
  }
  return [...starts, ...contains].slice(0, limit);
}

export function findCourse(name: string): CourseOption | undefined {
  const target = name.trim().toLowerCase();
  return COURSE_CATALOG.find((c) => c.name.toLowerCase() === target);
}
