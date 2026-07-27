# GRIT Project Configuration & Execution Rules

## Tech Stack & Architecture
- Frontend: Next.js (App Router, TypeScript, Tailwind CSS, Shadcn-style UI, Framer Motion)
- Backend & Auth: Supabase (PostgreSQL, Row Level Security, Storage, Edge Functions)
- State & Forms: React Query (TanStack), Zustand, React Hook Form, Zod

Note: scaffolded on Next.js 15.5.22 rather than 14.x — `npm audit` flagged the
entire 14.2.x line for the same advisories that 15.5.22 already patches
(`npm audit --omit=dev` is clean on this app). Same App Router conventions
either way. Also on `@supabase/ssr@^0.12.3` rather than the originally
scaffolded `^0.5.2` — that version's bundled types referenced internal
`supabase-js` paths that no longer exist in current `supabase-js`, which
silently resolved all typed table calls to `never` instead of erroring.

## Auth & backend status (Phase 3)

Login/signup/onboarding pages, `middleware.ts` route protection, and the
`/api/roadmap/generate` + `/api/outreach/generate` routes are built and
type-checked, but **no Supabase project or AI key is configured in this
environment** — none of it has run against a real backend. Both API routes
detect missing env vars and return a clear `501` instead of crashing; the
middleware skips auth enforcement entirely until
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` are set. See the
main README's "No real backend is connected" section for exact details and
setup steps.

5 of the 10 "live" dashboard features (Streak/Badges, Resume Builder,
Weekly Tasks, Hours Logger, Credential Vault) now try a real API first
(`/api/dashboard/state`, `/api/hours`, `/api/credentials`) and fall back to
`lib/mock-data.ts` / local state when unauthenticated, with a "Your data" /
"Sample data" badge always showing which is active. The other 5 (GPA
calculator, AP/IB optimizer, certification rulebook, CTSO strategy engine,
cold-outreach template) don't need per-user persistence and were left as
pure client-side tools. Not built yet: the hours-verification-link
endpoint, persisting the hours-logger's signature capture (no column for
it), and a credential review/`is_verified` flow.

## Design System & Aesthetic ("Grit")
- Color palette: dark coffee-brown background with a monochrome forest-green
  interactive family (primary/secondary/accent) layered on top — no yellow,
  no teal, no generic blue SaaS blue. Defined as CSS custom properties in
  `app/globals.css`, themed for both light and dark.
- UI components: rounded cards and pill-shaped buttons/nav (`--radius`),
  hover-lift on cards, hover/press scale on buttons, clean serif/sans type
  hierarchy (`--font-display` / `--font-sans`), soft background fills.
- Fun over corporate: prefer playful copy, satisfying micro-interactions,
  and visible progress/streak feedback over flat static text — every new
  feature should feel like part of a game you're winning, not a form you're
  filling out.

## Domain Logic & State Rules
- Age-gated credentials: student state/ZIP determines eligibility. Enforce
  age floors (e.g., CPR ~14, CNA 16 in most states/18 in some, EMT/Phlebotomy
  practice restricted until 18 or senior year) with dynamic prerequisite
  warnings — see `lib/roadmap/age-rules.ts` and
  `supabase/migrations/0002_career_track_and_certifications_seed.sql`.
- 4-year matrix structure: every pathway is organized into 5 timeline tiers —
  Summer -0 (pre-9th), Grade 9, Grade 10, Grade 11, Grade 12 — see
  `lib/constants.ts` (`GRADE_LEVELS`).
- Tracks supported: Pre-Medicine/Clinical Healthcare, Nursing & Advanced
  Practice, Software Engineering, Financial Engineering, Mechanical
  Engineering/CAD, Law & Public Policy — see `lib/roadmap/templates/`.
  CTECH/P-TECH and Business/DECA-specific tracks are on the feature list
  below but don't have their own dedicated `CareerTrackTemplate` yet.

## Code Style & Safety Guidelines
- Always use strict TypeScript types generated from the Supabase DB schema.
- Validate all incoming API and form payloads with Zod schemas.
- Ensure Supabase Row Level Security (RLS) policies are active on every new
  table created (pattern: `for select/insert/update/delete using (auth.uid()
  = user_id)`, or via a parent-ownership `exists` subquery when the table
  has no direct `user_id`, as `milestones` does through `roadmaps`).
- Never write hardcoded inline secret keys; use environment variables
  (`process.env`).

## Feature Roadmap (30 features, 9 categories)

Status legend: **live** = real client-side logic against real seed data,
**mock** = working UI with clearly-labeled sample data (no real backend/API
behind it yet), **planned** = nav entry + "coming soon" card only.

1. High-Yield Academics & Advanced Placement
   1. Target GPA & Grade-Aiming Calculator — **live**
   2. AP/IB Course Optimizer — **live**
   3. Dual-Enrollment & Transferability Predictor — planned
   4. Specialized High School 4-Year Planner — planned (the roadmap/matrix
      already covers this; a dedicated academics-only view is still open)
2. Specialized Technical & Early College Hubs (CTECH / P-TECH)
   5. CTECH Program Integration — planned
   6. P-TECH Associate Degree Tracker — planned
   7. CTE Articulation Credit Vault — planned
3. College Targeting & Major Alignment
   8. Career-to-College Target Matcher — planned
   9. Direct-Admit & BS/MD Pathway Planner — planned
   10. University Essay Prompt Deconstructor — planned
4. State Rules, Legal & Compliance Engine
   11. State-by-State Certification Rulebook — **live**
   12. Youth Minor Working Laws & Permit Guide — planned
   13. Shadowing & Clinical Liability Hub — planned
5. Jobs, Paid Work & Financial Independence
   14. Entry-Level Youth Job & Internship Board — **mock**
   15. Stipend & Micro-Grant Finder — **mock**
   16. W-4 & Youth Tax Essentials Guide — planned
6. Transportation & License Milestones
   17. Driver's License & Mobility Progress Tracker — planned
   18. Transit & Commute Route Planner — planned
7. Real-World Experience & Extracurriculars
   19. CTSO Competition Strategy Engine — **live**
   20. AI-Powered Cold Outreach Generator — **mock** (template-based
       mail-merge for now; wiring an actual LLM call is a Phase 3 item once
       an AI SDK key is configured)
   21. Clinical & Volunteer Hours Verification Logger — **live** (tries
       `/api/hours` first, falls back to local state; the signature
       capture itself is still session-only — no column for it yet)
   22. High-Yield Summer Program Directory — **mock**
8. Digital Portfolio & Resume Tools
   23. Dynamic "Grit" Resume Builder — **live**
   24. Public Student Portfolio Handle (`grit.hs/student`) — planned
   25. Digital Credential Vault — **live** (tries `/api/credentials`,
       which really does upload to Supabase Storage + `user_credentials`;
       falls back to local-only preview when unauthenticated)
9. Execution, Mentorship & Accountability
   26. Weekly Task Deconstructor — **live**
   27. "Streak & Grit" Gamified Score System — **live**
   28. Near-Peer Mentor Matcher — **mock**
   29. Counselor & Advisor Export Hub — planned
   30. Parent Read-Only Dashboard — planned
