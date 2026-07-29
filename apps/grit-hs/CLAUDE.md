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
- Surface material ("Liquid Glass" / "candy glass"): cards, the sidebar, and
  the header are heavily transparent, forest-green-tinted glass (`bg-card`
  down to ~15-22% opacity), blurred + saturated (`backdrop-blur-2xl
  backdrop-saturate-200`), with a bright `--glass-border` edge, a permanent
  glossy specular highlight blob (top-left radial gradient), and a one-shot
  diagonal light-sweep on hover — floating over a slow-drifting ambient
  green glow (`components/layout/ambient-glow.tsx`) behind the opaque brown
  background, instead of flat opaque panels. Went through several rounds:
  slate-tinted glass -> green-tinted glass -> brighter/more-saturated
  primary+accent -> ambient glow + hover sweep + gradient wordmark -> much
  more transparent + permanent glossy shine + gumdrop-style buttons ("candy
  glass"). A generic design-system lookup suggested a slate+red "Liquid
  Glass" pairing at the start; only the glass *material* was adopted, never
  the palette — brown+green stays. See `components/ui/card.tsx`,
  `components/ui/button.tsx`, and the `--card`/`--glass-*` tokens.
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

## Feature Roadmap (30 features + 1 bonus, 9 categories)

Status legend: **live** = real client-side logic against real seed data,
**mock** = working UI with clearly-labeled sample data (no real backend/API
behind it yet), **planned** = nav entry + "coming soon" card only.

1. High-Yield Academics & Advanced Placement
   1. Target GPA & Grade-Aiming Calculator — **live**
   2. AP/IB Course Optimizer — **live**
   3. Dual-Enrollment & Transferability Predictor — **live** (scoped down:
      only California's ASSIST and Texas's TCCNS are independently
      verified real statewide systems, so the tool names those two and
      links out to them; every other state gets an honest "no verified
      database found, ask your target school's registrar" rather than a
      fabricated course-mapping table)
   4. Specialized High School 4-Year Planner — **live** (real career-track
      electives per year, paired with a generic — explicitly not
      state-specific — core graduation requirements model)
2. Specialized Technical & Early College Hubs (P-TECH)
   6. P-TECH Associate Degree Tracker — **live** (a real explainer of what
      P-TECH is + IBM's real current P-TECH page (the old ptech.org
      directory link died — see Round 10) + a local tracker for the
      student's own program — deliberately not a fabricated national
      school roster)
   - #5 CTECH Program Integration and #7 CTE Articulation Credit Vault were
     removed from the app entirely in Round 12 (see below) rather than left
     as "coming soon" — #6's number stays as-is; #5/#7 are retired, not
     renumbered.
3. College Targeting & Major Alignment
   8. Career-to-College Target Matcher — **live** (real data from the U.S.
      Dept of Education's College Scorecard API — admit rate, tuition,
      10-yr median earnings for 6,000+ institutions; search by name/state,
      not a curated "best for your track" ranking, since that would need
      CIP-code field-of-study filtering not yet verified — see
      `app/api/college-matcher/route.ts`, needs `COLLEGE_SCORECARD_API_KEY`)
   9. Direct-Admit & BS/MD Pathway Planner — **live** (scoped down: only 5
      programs — GWU, Howard, USF, UAB EMSAP, Brown PLME — were
      individually checked against their own admissions pages rather than
      trusted from a single research pass; every other AAMC-listed program
      is left out on purpose rather than seeded with an unverified GPA/test
      cutoff, with a link to AAMC's official full directory instead)
   10. University Essay Prompt Deconstructor — **live** (splits any pasted
       prompt into its sub-questions + word-count target, pairs each with
       one of your own completed milestones — no AI call, no fabricated
       college-specific prompts)
4. State Rules, Legal & Compliance Engine
   11. State-by-State Certification Rulebook — **live**
   12. Youth Minor Working Laws & Permit Guide — **live** (real federal
       FLSA baseline from DOL Fact Sheet #43, verified — deliberately
       does NOT include a 50-state table since that wasn't verified
       per-state; links to DOL's official state comparison instead)
   13. Shadowing & Clinical Liability Hub — **live** (real HIPAA/OSHA
       regulatory guidance — 45 CFR §164.501/§160.103, 29 CFR 1910.1030 —
       informational only, explicitly not a waiver generator)
5. Jobs, Paid Work & Financial Independence
   14. Entry-Level Youth Job & Internship Board — **mock**
   15. Stipend & Micro-Grant Finder — **mock**
   16. W-4 & Youth Tax Essentials Guide — **live** (a rule-based Form W-4
       exemption wizard — deliberately doesn't hardcode this year's exact
       standard-deduction dollar figure since that goes stale annually;
       links to IRS.gov for the current number)
6. Transportation & License Milestones
   17. Driver's License & Mobility Progress Tracker — **live** (permit
       hours counter, driver's-ed toggle, road-test countdown)
   18. Transit & Commute Route Planner — **live**, but rescoped — real
       nearby transit stops + routes via Transitland's stable REST API,
       NOT full point-to-point trip routing. Verified this round that a
       prior research report's "BUILD NOW" verdict was wrong:
       OpenRouteService has no public-transit routing mode at all (only
       car/bike/walk/wheelchair), and Transitland's actual routing engine
       is explicitly labeled beta by their own docs. Needs
       `TRANSITLAND_API_KEY`.
7. Real-World Experience & Extracurriculars
   19. CTSO Competition Strategy Engine — **live**
   20. AI-Powered Cold Outreach Generator — **live** (real mail-merge
       template plus a "Generate with AI" button that calls
       `/api/outreach/generate` — Vercel AI SDK + Claude — and says so
       plainly if `ANTHROPIC_API_KEY` isn't configured rather than faking a
       result)
   21. Clinical & Volunteer Hours Verification Logger — **live** (tries
       `/api/hours` first, falls back to local state; has a real printable
       PDF summary and a real public supervisor-confirmation link at
       `/verify-hours/[token]`; the signature capture itself is still
       session-only — no column for it yet)
   22. High-Yield Summer Program Directory — **mock**
8. Digital Portfolio & Resume Tools
   23. Dynamic "Grit" Resume Builder — **live**
   24. Public Student Portfolio Handle — **live** (opt-in public page at
       `/p/[handle]`; off by default, service-role API route hand-picks
       only safe fields to expose publicly — never zip_code/state/user_id
       — see `supabase/migrations/0004_public_portfolio_handle.sql` and
       `app/api/portfolio/[handle]/route.ts`)
   25. Digital Credential Vault — **live** (tries `/api/credentials`,
       which really does upload to Supabase Storage + `user_credentials`;
       falls back to local-only preview when unauthenticated)
9. Execution, Mentorship & Accountability
   26. Weekly Task Deconstructor — **live**
   27. "Streak & Grit" Gamified Score System — **live**
   28. Near-Peer Mentor Matcher — **mock**
   29. Counselor & Advisor Export Hub — **live** (real printable one-pager:
       roadmap progress, milestones by category, hours totals, credential
       count — pulls the same real/sample data each source feature already
       uses)
   30. Parent Read-Only Dashboard — **live** (same real/sample stats +
       full read-only Milestone Matrix; no forms, no upload controls, no
       edit paths at all)
   31. Track Leaderboard (bonus, not in the original 30) — **live** (see
       Round 11: real, app-wide, gated on the existing public-portfolio
       opt-in — no new privacy surface)

## Round 4: visualization + gamification additions

From a later brainstorm of ~16 ideas (high-tech visuals, social/competition,
gamification, logistics), 4 were built, honestly scoped as real widgets
against existing data rather than new backend surface area:

- **Skill Coverage Radar Chart** (`components/roadmap/skill-radar-chart.tsx`)
  — hand-rolled SVG radar on `/roadmap`, one axis per milestone category,
  percent-complete computed from the same template + derive-status logic
  the Milestone Matrix already uses.
- **Hours Activity Heatmap** (`components/features/hours-heatmap.tsx`) — a
  12-week GitHub-style calendar heatmap inside the Hours Logger, colored by
  hours logged per day from the same `entries` state (real or sample,
  matching whichever the logger is already showing).
- **Focus Mode** (`components/dashboard/focus-mode.tsx`) — a dashboard
  toggle that collapses the 3 stat cards down to just the next 2 incomplete
  milestones, for a distraction-free "what do I do right now" view.
- **Track Leaderboard** (#31 above).

Explicitly **not built** from that same brainstorm, and why: AI-generated
mentor avatars (needs an image-gen API, none configured), verified
cohort/social matching and an alumni showcase feed (both need real user
accounts and moderation, not just UI), CTSO AI-judge mock practice (needs a
real LLM judging rubric, high fabrication risk without one), an
informational-interview booking marketplace (two-sided marketplace, out of
scope for a solo-student app), a minor work-permit form generator (risk of
confidently fabricating state-specific legal forms), a literal 3D/WebGL
skill tree, and a QR code for the hours-verification link (needs a new
dependency; deferred, not declined). Car license + job board ideas from
that list were already covered by existing features #17 and #14 and were
not rebuilt.

## Round 5: 3 more features converted from "coming soon" to real

#10 Essay Prompt Deconstructor, #29 Counselor & Advisor Export Hub, and #30
Parent Read-Only Dashboard are now live, all built without any new
fabricated content — each is either a generic client-side tool (essay
splitter) or an aggregation view over data other features already fetch
(export hub, parent dashboard reuse `useDashboardData`, `/api/hours`,
`/api/credentials`, and the existing `MilestoneMatrix` component). 11
features remain planned: #3, #5, #6, #7, #8, #9, #12, #13, #16, #18, #24 —
mostly held back because building them honestly would require real
institution-specific or state-specific data (college admissions stats,
CTECH/P-TECH program details, articulation agreements, state labor law)
that isn't sourced in this environment; fabricating specifics there would
be worse than leaving them as "coming soon."

## Round 6: real external data sourcing for the remaining features

A deep-research pass (external, not this session's own tools) evaluated a
real authoritative data source for each of the 9 still-planned features that
need external data. Verdicts, condensed:

- **BUILD NOW** (clean free API, no manual curation): #8 Career-to-College
  Target Matcher (College Scorecard API) and #18 Transit & Commute Route
  Planner (GTFS via Transitland/OpenRouteService).
- **BUILD WITH MAINTENANCE** (real source, but static/manual, needs periodic
  re-ingestion): #5/#6 CTECH & P-TECH Tracker (ptech.org + state CTE
  registries), #9 Direct-Admit & BS/MD Planner (AAMC's official directory),
  #12 Youth Labor Laws (DOL WHD state comparison tables), #13 Clinical
  Liability Hub (HHS OCR HIPAA guidance + OSHA 29 CFR 1910.1030 — info only,
  explicitly not a legal waiver generator), #16 W-4/Tax Guide (IRS Form
  W-4 + Pub 505).
- **DO NOT BUILD YET** (no aggregated source exists at all): #3
  Dual-Enrollment Predictor and #7 CTE Articulation Vault — both are
  decentralized, per-district/per-state legal agreements (ASSIST.org has no
  public API as of the research date; CTE articulation MOUs live in
  unstructured per-district PDFs). Would need real per-region manual data
  collection to build honestly, not scraping/fabrication.

**#8 Career-to-College Target Matcher was built this round** —
`app/api/college-matcher/route.ts` proxies the real College Scorecard API
server-side (same env-var-gated-501 pattern as every other API route;
needs a free `COLLEGE_SCORECARD_API_KEY` from api.data.gov). Deliberately
scoped as a plain search (by school name/state) rather than a "matched to
your career track" ranking, since that would require CIP-code
field-of-study query parameters this session didn't verify precisely
enough to trust — mis-mapping a CIP code would silently return wrong
schools for a track, which is worse than not filtering at all.

The other 8 features in this list remain planned. Building the
"BUILD WITH MAINTENANCE" tier means hand-transcribing real government/
official-source tables into seed data (same pattern as the certifications
catalog) — real work, not a quick follow-up — so each should be its own
explicit ask rather than assumed.

## Round 7: 5 more features, all against verified real sources

#6 P-TECH Tracker, #12 Youth Labor Laws, #13 Clinical Liability Hub, #16
W-4/Tax Guide, and #18 Transit Planner are now live. Each was scoped down
from its original ask specifically to stay inside what's actually verified:

- **#12 and #16 deliberately omit exact numbers that go stale** (50-state
  hour tables, this year's standard deduction) rather than hardcode
  something that will silently become wrong — both link to the live
  government source instead.
- **#18 was rescoped mid-build**: the research this round said "BUILD NOW"
  for a full transit route planner, but verification found that's wrong —
  OpenRouteService has no transit routing mode, and Transitland's actual
  routing engine is beta per their own docs. Built nearby-stops +
  served-routes instead (Transitland's stable REST API), not point-to-point
  directions.
- **#6 explicitly does not fabricate a P-TECH school roster** — no national
  API exists for that, so it explains the real program model, links to the
  official directory, and lets the student track their own program's real
  details.
- **#9 (BS/MD planner) and #5 (CTECH) were NOT built** this round despite
  having research entries — AAMC's directory is real but this session
  didn't verify the ~50-70 programs' individual GPA/test-score cutoffs, and
  CTECH has no aggregated source at all. Both stay "coming soon" rather
  than risk a wrong number on a real admissions decision.
- **#3 and #7 also remain untouched** — the research's own verdict for
  both was "do not build," confirmed: no aggregated source exists for
  either dual-enrollment articulation or CTE credit MOUs.

26 of 31 features are now live or mock (20 live, 6 mock); 5 remain planned
(#3, #5, #7, #9, and #24 as of round 6 — #24 was built in round 8, see
below). New env vars: `COLLEGE_SCORECARD_API_KEY`, `TRANSITLAND_API_KEY`
(both free).

## Round 8: #24 Public Student Portfolio Handle

Structure-only, like the rest of Phase 3 — no live Supabase project to
test against, but everything is real and type-checked, and the SQL
migration was validated against a local throwaway Postgres before being
trusted (same process used for the 0003 storage migration).

- **`supabase/migrations/0004_public_portfolio_handle.sql`** — adds
  `handle` (unique) and `portfolio_public` (default `false`, opt-in) to
  `profiles`.
- **`app/api/portfolio/route.ts`** — authenticated GET/PATCH for a student
  to set their own handle and toggle public/private.
- **`app/api/portfolio/[handle]/route.ts`** — the public-facing read,
  using the service-role client (like `/api/hours/verify/[token]`) rather
  than a public RLS policy on `profiles`. This matters for a minors'
  product: the route hand-picks exactly which fields to return (name,
  track, grade, XP, completed milestones, public credentials) and never
  touches `zip_code`, `state`, or `user_id`, even though the service-role
  client could technically see them.
- **`app/p/[handle]/page.tsx`** — the public page itself, outside the
  auth-protected route groups (same pattern as `/verify-hours/[token]`).
- **`components/features/public-handle.tsx`** — the dashboard-side
  management UI (set handle, toggle public, preview link).

27 of 31 features are now live or mock; 4 remain planned (#3, #5, #7, #9).

## Round 9: first real deployment, and everything that broke because of it

Every prior round was built and type-checked without ever running against a
live Supabase project or a real Vercel deployment (see "Auth & backend
status" above). Once actually deployed this round, several integration
bugs surfaced that no amount of local type-checking could have caught —
each is a real fix, not a config tweak:

- **Missing baseline Postgres grants** (`0005_grant_baseline_schema_privileges.sql`)
  — a Supabase project provisioned via the Management API (rather than the
  dashboard's "New project" button) never got `anon`/`authenticated`/
  `service_role` granted `SELECT`/`INSERT`/`UPDATE`/`DELETE` on any table.
  Every request failed with `permission denied for table X` one layer
  *before* RLS was ever evaluated — including for `service_role`, so even
  the admin client couldn't read `profiles`. This silently made every real
  signup/write impossible; RLS policies were all correct and irrelevant
  until this was fixed.
- **Onboarding redirect gap** (`lib/supabase/middleware.ts`) — `signUp()`
  doesn't return a session until email confirmation, so the client-side
  `router.push("/onboarding")` after signup never ran; after confirming
  and logging in, middleware sent every authenticated user straight to
  `/dashboard` with no check for whether a `profiles` row existed yet. Real
  accounts got stuck seeing only the mock-data fallback forever, with no
  path back to onboarding. Middleware now redirects an authenticated user
  with no profile to `/onboarding`.
- **Dashboard and Roadmap pages were never wired to real data at all** —
  unlike the 5 features that already try `useDashboardData()` first, both
  `app/(dashboard)/dashboard/page.tsx` and `app/(dashboard)/roadmap/page.tsx`
  (plus `components/features/parent-dashboard.tsx`) rendered `MOCK_STUDENT`
  unconditionally. All three now follow the same real/mock pattern (with
  the "Your data"/"Sample data" badge) as the rest of the app.
- **No way to actually mark a milestone complete against real data** — mock
  mode infers status purely from grade-level ordering
  (`lib/roadmap/derive-status.ts`); real `milestones.status` rows existed
  in the DB but nothing ever updated them past `not_started`. Added
  `PATCH /api/milestones/[id]` (ownership-checked via the existing RLS
  policy) and a "Mark complete"/"Mark incomplete" button on every
  `MilestoneCard`, which also awards/revokes `MILESTONE_XP_AWARD` (100 XP)
  on the student's `profiles.xp_points`.
- **New Skill Tree visualization** (`components/roadmap/skill-tree.tsx`) —
  a hand-rolled SVG tree on `/roadmap`, one branch per milestone category
  fanning out from a trunk, one node per grade-level milestone along each
  branch, colored by real status; clicking a node (real data only) marks
  it complete/incomplete through the same endpoint above. This is the
  literal skill-tree idea noted as explicitly-not-built in Round 4 — built
  now as a real interactive feature against real per-user data rather than
  a decorative visual, once there was real data to visualize.
- Corrected the #20 Cold Outreach status above from **mock** to **live** —
  it already called the real `/api/outreach/generate` endpoint as of an
  earlier round; this file's own status line just hadn't been updated to
  match.

Also confirmed and left alone rather than silently building: **#31 Track
Leaderboard stays mock** — a real cross-student leaderboard needs opt-in
cohort matching and privacy controls (this is a minors' product; the
public-portfolio and hours-verification features are deliberately careful
about exactly which fields ever leave the service-role boundary), which is
its own explicit design ask, not a quick follow-up.

## Round 10: #3 and #9 converted from "coming soon" to real, after
## three independent research passes and manual spot-verification

ChatGPT, Gemini, and Copilot were each given the identical deep-research
prompt for the 4 remaining planned features (#3, #5, #7, #9), specifically
so the results could be cross-referenced against each other rather than
trusted individually — and it was worth it: the very first spot-check (of
Augusta University's BS/MD program) found ChatGPT's answer had conflated
it with UAB's differently-named "EMSAP" program and asserted a GPA number
with no independent confirmation. That's exactly the failure mode Round
6-9 already worried about, so nothing from any of the three reports was
seeded until it was independently re-checked (via direct fetch/search
against the primary source, not just cross-reading the three reports
against each other).

- **#3 Dual-Enrollment & Transferability Predictor** — only California's
  ASSIST and Texas's TCCNS held up: real, public, independently confirmed
  systems (all 3 research passes converged on both). One thing all three
  reports got wrong or omitted: ASSIST's *website* is real and free to
  search by a human, but its developer API is not an open public API —
  ASSIST's own Winter 2025 newsletter says API access is still rolling out
  to "approved subscribers and campus partners," so this is a real/link-out
  feature, not a live automated query, same shape as #6/#12/#13/#16/#18.
  Every other state gets an honest "no verified database found" rather
  than the specific (unverifiable) course-mapping examples all three
  reports offered for states like Florida, Virginia, or Illinois.
- **#9 Direct-Admit & BS/MD Pathway Planner** — 5 programs made it in,
  each individually confirmed against its own admissions page: George
  Washington (3.60 GPA, ~90th percentile SAT/ACT), Howard (3.5 GPA,
  SAT 1300+/ACT 28+ — converged independently in 2 of the 3 reports),
  USF's 7-year program (4.0 weighted GPA, SAT 1500+/ACT 34+, also
  converged in 2 reports), UAB's EMSAP (correctly named, 3.5 GPA,
  SAT 1360+/ACT 30+), and Brown's PLME (deliberately publishes no numeric
  cutoff — confirmed by 2 of 3 reports agreeing on that absence, which is
  itself a safely statable fact). AAMC's own official directory
  (~50-70 programs total) is linked for everything else, explicitly
  labeled unverified rather than seeded.
- **#5 CTECH Program Integration and #7 CTE Articulation Vault stay
  planned** — all three research passes gave completely non-overlapping
  sets of specific schools/agreements (zero shared examples between any
  two reports), which is itself a signal, not just a coverage gap; none of
  it cleared the same bar #3/#9 did.
- Also fixed: the already-shipped #6 P-TECH Tracker linked to
  `ptech.org/our-schools` as "the official directory" — confirmed dead
  (parked domain) by an independent check and by all 3 research passes.
  Replaced with IBM's real, current P-TECH overview page, and added the
  verified origin story (Brooklyn, September 2011, NYC Public
  Schools + CUNY's NYC College of Technology + IBM).

29 of 31 features are now live or mock; 2 remain planned (#5, #7).

## Round 11: #31 Track Leaderboard, real — without adding a new privacy surface

Asked whether to build a real cross-student leaderboard, the two questions
that actually mattered were settled explicitly rather than assumed:
what identity shows for an opted-in student, and what cohort can see whom.

- **Identity**: reuses the existing public-portfolio opt-in (`handle` +
  `portfolio_public` from Round 8/#24) rather than building a second,
  parallel opt-in toggle. A student only appears on the leaderboard if
  they've already made their portfolio public — no new column, no new
  consent surface, no new field ever exposed beyond what `/p/[handle]`
  already shows publicly.
- **Cohort**: app-wide, not scoped to career track — simpler query, and the
  identity constraint above already limits who appears to begin with.
- **`GET /api/leaderboard`** (new) uses the service-role client the same
  way `/api/portfolio/[handle]` already does — selecting only `handle` and
  `xp_points` for `portfolio_public=true` rows, ordered by XP, capped at
  50. The requester's own real XP is always included via the regular
  authenticated client (their own row, RLS-covered), even before they've
  opted in, with a visible prompt to opt in if they haven't.
- **Streak was deliberately left out of the real version** — `profiles`
  has no persisted streak column; the mock leaderboard's streak numbers
  were always local-only `useState` in `streak-score.tsx`, never real, so
  showing a fabricated streak for other students would be worse than
  showing none. The real leaderboard shows XP only; mock mode keeps its
  existing streak column, unchanged.

Still 29 of 31 live or mock, 2 remain planned (#5, #7) — #31 moves from the
"mock" bucket to "live" within that same count, it doesn't change the total.

## Round 12: #5 and #7 removed entirely, not left as "coming soon"

Rather than continue carrying #5 CTECH Program Integration and #7 CTE
Articulation Credit Vault as permanent "coming soon" cards — three
independent research passes already failed to find a real aggregated
source for either (Round 10) — both were removed from the app outright:
deleted from `lib/features/registry.ts`, no longer appear in the sidebar
or feature grid at all. #6 P-TECH Tracker keeps its number; #5 and #7 are
retired rather than renumbered, so the numbering elsewhere in this doc
still lines up with what actually shipped at each point.

29 of 31 original features are now live or mock; the remaining 2 are gone,
not planned.

## Round 13: button audit, real track-personalization, and an in-app Reminders widget

Asked to make every button functional, make features actually specific to
the student's career track, and add reminders. The button audit came back
clean — every `<Button>`/`<button>` in the app already had a working
handler, nothing was actually dead. The other two were real gaps:

- **Real bug found and fixed**: `mentor-matcher.tsx` always matched against
  `MOCK_STUDENT.targetCareer`, even for a real logged-in student with a
  different real track — so "same track" mentors were wrong for anyone
  not on the pre-med track. Now uses the real profile's `target_career`
  when authenticated.
- **CTSO Strategy Engine** now defaults its track filter to the student's
  own real track on first load (still overridable to "All tracks" or any
  other track manually).
- **Certification Rulebook** adds a "Show only certs relevant to
  [my track]" toggle, mapped via a real category (healthcare/finance/
  engineering/technology per track); Law & Public Policy has no certs in
  this catalog, so it's left unmapped rather than forced onto an unrelated
  category.
- **Job Board and Summer Program Directory** (both still sample-data
  features) now tag each sample entry with a real career track and sort
  track-matching entries first with a "Matches your track" badge — the
  underlying listings are still sample data (per their existing banners),
  but which ones surface first is now genuinely track-aware.
- **New Reminders widget** (`components/dashboard/reminders.tsx`, on the
  Dashboard Overview) combines two kinds of nudges, kept clearly separate:
  - Real, computed nudges for logged-in students: incomplete milestones at
    their current grade, days since their last hours-log entry, an empty
    Credential Vault, and not yet having a public portfolio handle — all
    read from data that already exists, nothing new to persist.
  - One evergreen, track-specific tip per track, phrased around how each
    track's key credential actually works structurally (AP exams run in
    May; FINRA SIE/AWS/CompTIA/SOLIDWORKS certs are on-demand,
    computer-based, no fixed date) rather than a specific date that would
    go stale — same anti-fabrication discipline as the Tax Guide and Youth
    Labor Laws features.
  This is in-app only, on the dashboard — no email/push infrastructure was
  added, since none was asked for.
