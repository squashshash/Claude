# Grit

4-year career-specialization roadmap platform for high schoolers.

- **Phase 1** (done): project layout + initial Supabase schema.
- **Phase 2** (done): Next.js app scaffold, dashboard shell (sidebar/header/XP),
  and the Milestone Matrix/Card/Progress/Age-Gate components, rendering real
  data seeded from a research doc on early-secondary career specialization
  (6 career tracks, certification age-eligibility rules).
- **Feature build** (done): a 30-feature roadmap across 9 categories — see
  `CLAUDE.md` for the exact status of each. 12 are fully live/interactive
  (GPA calculator, AP/IB optimizer, certification rulebook, CTSO strategy
  engine, cold-outreach generator, hours logger w/ signature pad + PDF
  export, weekly task deconstructor, streak/badges, resume builder,
  credential vault, 4-year planner, driver's license tracker), 4 are
  clearly-labeled sample-data pages, the rest fall through to an honest
  "coming soon" card.
- **Phase 3** (done, structure-only — see below): auth (login/signup,
  protected routes via middleware), the Summer -0 onboarding wizard, a real
  roadmap-generation API route, and an AI cold-outreach endpoint wired to
  the Vercel AI SDK.
- **Real-data wiring** (done, structure-only — see below): the Streak/Badges,
  Resume Builder, Weekly Tasks, Hours Logger, and Credential Vault features
  now try a real Supabase-backed API first (`/api/dashboard/state`,
  `/api/hours`, `/api/credentials`) and **fall back to `lib/mock-data.ts` /
  local state automatically** when there's no signed-in user or no project
  configured — so they stay demonstrable now and become real the moment
  credentials exist. Each shows a "Your data" vs "Sample data" badge so
  it's never ambiguous which one you're looking at.
- **Round 3** (done): a public supervisor hours-verification link flow
  (`/verify-hours/[token]`, using the service-role client since the
  supervisor has no account), a printable PDF summary for the Hours
  Logger, and two more registry features converted from "coming soon" to
  real, fully client-side tools (#4 4-Year Planner, #17 License Tracker).
- **Round 4** (done): a "Liquid Glass" surface pivot — cards, sidebar, and
  header are now translucent, blurred, slate-edged glass panels floating
  over the same brown background/green interactive palette (palette
  unchanged, only the surface material) — plus 4 new visualization/
  gamification features: a Skill Coverage radar chart on `/roadmap`, a
  12-week activity heatmap in the Hours Logger, a dashboard "Focus Mode"
  toggle, and a new bonus feature (#31) Track Leaderboard. See `CLAUDE.md`
  for exactly what was scoped out of that round's larger brainstorm and why.
- **Round 5** (done): pushed the glass design several rounds further —
  green-tinted glass, brighter primary/accent, an ambient background glow,
  a hover light-sweep, a gradient wordmark, and finally much more
  transparent "candy glass" with a permanent glossy shine and gumdrop-style
  buttons — plus 3 more registry features converted from "coming soon" to
  real (#10 Essay Prompt Deconstructor, #29 Counselor & Advisor Export Hub,
  #30 Parent Read-Only Dashboard), all built by reusing existing real/sample
  data rather than any new fabricated content. 11 features remain planned —
  see `CLAUDE.md` for which ones and why (mostly real institution- or
  state-specific data this environment doesn't have).
- **Round 6** (done): a deep-research pass identified real authoritative
  data sources for the remaining 9 data-dependent features (verdicts in
  `CLAUDE.md`) — 2 have clean free APIs, 5 have a real source but need
  static curation, 2 have no aggregated source at all and shouldn't be
  built without real per-region data collection. Built #8 Career-to-College
  Target Matcher against the real U.S. Dept of Education College Scorecard
  API (`app/api/college-matcher/route.ts`, needs a free
  `COLLEGE_SCORECARD_API_KEY`) — a plain school search, not a "matched to
  your track" ranking, since that needs CIP-code filtering not yet verified
  precisely enough to trust. Also fixed a real layout bug this round: the
  candy-glass button styling's `overflow-hidden` could clip button label
  text when a button was squeezed by flex siblings — fixed globally with
  `shrink-0` on the button base styles.
- **Round 7** (done): 5 more features built against verified real sources —
  #6 P-TECH Tracker, #12 Youth Labor Laws, #13 Clinical Liability Hub, #16
  W-4/Tax Guide, #18 Transit Planner. Two of these deliberately omit
  numbers that go stale (50-state hour limits, this year's standard
  deduction), linking to the live government source instead of hardcoding
  something that'll silently go wrong later. #18 was rescoped mid-build
  after verifying the prior research's "BUILD NOW" verdict was actually
  wrong — no free API does full transit trip routing, so it shows nearby
  stops instead. #9 (BS/MD planner) and #5 (CTECH) stayed "coming soon"
  since building them would've meant asserting unverified specifics
  (admissions cutoffs, program rosters) — see `CLAUDE.md` for the full
  reasoning. 26 of 31 features are now live or mock; needs a free
  `TRANSITLAND_API_KEY` in addition to the existing env vars.
- **Round 8** (done, structure-only): #24 Public Student Portfolio Handle —
  an opt-in shareable page at `/p/[handle]`, off by default. New migration
  (`0004_public_portfolio_handle.sql`, validated against a local throwaway
  Postgres before trusting it) adds `handle`/`portfolio_public` to
  `profiles`. The public read goes through the service-role client and
  hand-picks only safe fields to return — never zip_code, state, or
  user_id — rather than relying on a public RLS policy that could
  over-expose columns. 27 of 31 features are now live or mock.

## ⚠️ No real backend is connected in this environment

There is no Supabase project or AI provider key configured here. Everything
in Phase 3 is written to real conventions and type-checked/build-verified,
but **none of it has been tested against a live database or model** — that
requires credentials this sandbox doesn't have. Concretely:

- `middleware.ts` / `lib/supabase/middleware.ts` detect missing
  `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` and **skip auth
  enforcement entirely** so the app stays browsable without a project. Once
  those env vars are set, protected routes (`/dashboard`, `/roadmap`,
  `/features/*`, `/settings`, `/onboarding`) actually redirect unauthenticated
  visitors to `/login`.
- `app/api/roadmap/generate/route.ts`, `app/api/outreach/generate/route.ts`,
  `app/api/hours/route.ts`, `app/api/credentials/route.ts`, and
  `app/api/hours/verify/[token]/route.ts` all check for their required env
  vars first and return a clear `501 { error: "..." }` explaining exactly
  what's missing, rather than crashing or faking a result. Verified by
  curl — see the response text for the exact message. The public
  `/verify-hours/[token]` page renders that same error gracefully instead
  of a blank screen (verified by screenshot).
- 5 of the 10 "live" dashboard features (Streak/Badges, Resume Builder,
  Weekly Tasks, Hours Logger, Credential Vault) try `/api/dashboard/state`,
  `/api/hours`, or `/api/credentials` first and transparently fall back to
  `lib/mock-data.ts` / local state when unauthenticated — verified by
  screenshot, both API responses and the "Sample data" badges render as
  expected. The other 5 (GPA calculator, AP/IB optimizer, certification
  rulebook, CTSO strategy engine, cold-outreach template) don't need
  per-user persistence to function, so they were left as-is.
- The Hours Logger's signature-pad capture is **session-only** even when
  "Your data" — there's no column on `hours_logged` to persist the drawn
  signature to yet (a real implementation would upload it to Storage
  alongside the credential files and store the path).

To actually run this against a real backend: create a Supabase project, run
all four files in `supabase/migrations/` against it in order (the third
creates the `credentials` Storage bucket + its RLS policies, the fourth
adds the public-portfolio columns), copy `.env.local.example` to
`.env.local` and fill in the values, and (optionally) add
`ANTHROPIC_API_KEY` for live cold-outreach generation,
`COLLEGE_SCORECARD_API_KEY` (free from api.data.gov) for the College
Matcher, and `TRANSITLAND_API_KEY` (free from transit.land) for the
Transit Planner.

## Stack

Next.js 15 (App Router, TS) · Tailwind + hand-rolled Shadcn-style primitives ·
Supabase (Postgres, Auth, Storage) via `@supabase/ssr` · TanStack Query ·
Zustand · React Hook Form + Zod · Vercel AI SDK (`ai` + `@ai-sdk/anthropic`)

Note: scaffolded with Next.js 15.5.22 rather than 14 — `npm audit` flagged the
Next 14.2.x line for the same set of advisories, and 15.5.22 is the current
patched release with zero production-side vulnerabilities
(`npm audit --omit=dev` is clean). Also running `@supabase/ssr@^0.12.3`
rather than the originally-scaffolded `^0.5.2` — that older version's
bundled types referenced internal `supabase-js` paths that no longer exist
in current `supabase-js` releases, which silently broke all typed table
inference (Insert/Update calls resolved to `never` instead of erroring
loudly). Found and fixed while building the roadmap-generation route.

## Running it

```bash
cd apps/grit-hs
npm install
cp .env.local.example .env.local   # fill in real values to enable auth + AI
npm run dev   # app redirects / -> /dashboard
```

Without `.env.local` filled in: the app is fully browsable (no auth
enforced), and the two new API routes return a clear "not configured"
message instead of crashing.

## Proposed project structure

```
apps/grit-hs/
├── middleware.ts                    # session refresh + protected routes
├── app/
│   ├── layout.tsx                   # root layout, fonts, providers
│   ├── providers.tsx                # QueryClient wiring
│   ├── globals.css
│   ├── (auth)/
│   │   ├── layout.tsx               # centered auth shell
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── onboarding/page.tsx      # Module 1: Summer -0 questionnaire
│   ├── (dashboard)/
│   │   ├── layout.tsx               # sidebar + header shell
│   │   ├── dashboard/page.tsx       # overview, XP, current-year focus
│   │   ├── roadmap/page.tsx         # Module 2: 4-year matrix / skill tree
│   │   ├── features/[slug]/page.tsx # all 30 features, registry-driven
│   │   └── settings/page.tsx
│   └── api/
│       ├── roadmap/generate/route.ts    # onboarding -> real DB rows
│       └── outreach/generate/route.ts   # Vercel AI SDK endpoint
├── components/
│   ├── ui/                          # shadcn-style primitives
│   ├── layout/                      # sidebar (9 collapsible categories), header
│   ├── onboarding/                  # questionnaire steps
│   ├── roadmap/                     # milestone matrix, cards, skill tree
│   ├── certifications/              # age-gate badge
│   ├── features/                    # the 30-feature registry's components
│   └── shared/                      # xp counter
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # browser client
│   │   ├── server.ts                # server component / action client
│   │   ├── middleware.ts            # session refresh + route protection
│   │   └── admin.ts                 # service-role client, server-only
│   ├── features/registry.ts         # the 30-feature catalog (status + copy)
│   ├── roadmap/
│   │   ├── age-rules.ts             # client-side mirror of the cert catalog
│   │   ├── derive-status.ts         # grade/age -> milestone status
│   │   └── templates/               # per-career seed milestone data
│   ├── validations/                 # Zod schemas (auth, onboarding)
│   ├── constants.ts                 # career tracks, categories, grade levels
│   └── utils.ts
├── store/use-app-store.ts           # Zustand: onboarding wizard step
├── types/
│   ├── database.types.ts            # hand-written Supabase types (see below)
│   └── roadmap.ts
├── supabase/
│   ├── config.toml
│   └── migrations/
│       ├── 0001_init_schema.sql
│       └── 0002_career_track_and_certifications_seed.sql
└── public/
```

## Database schema (`supabase/migrations/`)

Six tables, all with RLS enabled:

- **profiles** — one row per user (`user_id` unique FK to `auth.users`);
  career track, grade, location, XP. `0004` adds an opt-in `handle` +
  `portfolio_public` for the public portfolio page.
- **roadmaps** — one row per generated 4-year plan; the full generated plan
  is also kept as `roadmap_json` for fast reads, with `milestones` as the
  normalized, per-node source of truth.
- **milestones** — individual nodes in the matrix, scoped to a roadmap via
  `roadmap_id`. Ownership for RLS is derived through the parent roadmap's
  `user_id` (no direct `user_id` column here, per the spec).
- **certifications** — shared reference catalog (19 real credentials) with
  per-state age rules in `state_rules_json`. Readable by any authenticated
  user; writes are expected to go through the service-role key.
- **hours_logged** — clinical/volunteer/shadowing hour entries. Includes a
  `verification_token` for the supervisor-verification link flow.
- **user_credentials** — uploaded certificates/licenses. `is_public` +
  `share_slug` back the public shareable badge feature.

Enums: `grade_level`, `milestone_category`, `milestone_status`,
`hours_category`, `hours_status`, and (0002) `career_track` — locked to the
6 tracks below.

`types/database.types.ts` is **hand-written** to match these migrations,
since there's no live Supabase project in this environment to run
`supabase gen types` against. Regenerate it from a real project instead of
hand-editing further once one exists.

## Career tracks & roadmap content (`lib/roadmap/templates/`)

Each of the 6 tracks has a full Summer -0 → Grade 12 milestone set (4
categories × 5 years = 20 milestones), taken from the research doc's
per-track progression tables rather than placeholder content:

- Pre-Medicine & Clinical Healthcare
- Nursing & Advanced Practice
- Software Engineering & Computational Systems
- Financial Engineering & Quantitative Finance
- Mechanical Engineering, CAD & Industrial Design
- Jurisprudence, Constitutional Law & Public Policy

Certification milestones that carry a real age gate (CNA, CCMA, FINRA SIE,
SOLIDWORKS CSWA) are linked to the certifications catalog via `certRef`, so
the Age-Gate Badge component computes "Locked · age N+ (X years to go)" from
the same rules as the database seed (mirrored client-side in
`lib/roadmap/age-rules.ts`, which now covers all 19 seeded certs).

## Auth & onboarding flow (Phase 3)

`/signup` → Supabase `auth.signUp` (handles the email-confirmation branch)
→ `/onboarding` (4-step wizard: career track, grade/state/ZIP, baseline,
review) → `POST /api/roadmap/generate` upserts the profile and inserts a
`roadmaps` row plus its full `milestones` set from the real templates →
redirects to `/dashboard`. `/login` uses `auth.signInWithPassword`.
`middleware.ts` refreshes the session and protects dashboard/onboarding
routes once a Supabase project is configured.

## Not yet built

The GPA calculator, AP/IB optimizer, certification rulebook, CTSO strategy
engine, 4-year planner, license tracker, and cold-outreach template still
don't persist anything (by design — none of them need to). Persisting the
hours-logger's signature capture to Storage is unbuilt (the
verification-link flow itself is real, see above). So is a real
`is_verified` review flow for uploaded credentials, the remaining ~14
"coming soon" features from the registry, and a marketing/landing page.
Next phase on request.
