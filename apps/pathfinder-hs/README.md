# Pathfinder HS

4-year career-specialization roadmap platform for high schoolers. Phase 1
scaffold: project layout + initial Supabase schema. No application code yet.

## Stack

Next.js 14 (App Router, TS) · Tailwind + Shadcn UI · Framer Motion ·
Supabase (Postgres, Auth, Storage) · TanStack Query + Zustand ·
React Hook Form + Zod · Vercel AI SDK (cold-email generator)

## Proposed project structure

```
apps/pathfinder-hs/
├── middleware.ts                    # session refresh + protected routes
├── app/
│   ├── layout.tsx                   # root layout, fonts, providers
│   ├── providers.tsx                # QueryClient + Zustand store wiring
│   ├── globals.css
│   ├── (marketing)/
│   │   └── page.tsx                 # landing page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── onboarding/page.tsx      # Module 1: Summer -0 questionnaire
│   ├── (dashboard)/
│   │   ├── layout.tsx               # sidebar + header shell
│   │   ├── dashboard/page.tsx       # overview, XP, current-year focus
│   │   ├── roadmap/page.tsx         # Module 2: 4-year matrix / skill tree
│   │   ├── certifications/
│   │   │   ├── page.tsx             # Module 3: age-requirement engine, vault
│   │   │   └── [id]/page.tsx
│   │   ├── outreach/page.tsx        # Module 4: cold-email generator
│   │   ├── hours/page.tsx           # Module 4: hours logger
│   │   └── ctso/
│   │       ├── page.tsx             # Module 5: CTSO event matchmaker
│   │       └── [eventId]/page.tsx
│   └── api/
│       ├── roadmap/generate/route.ts
│       ├── outreach/generate/route.ts   # AI SDK streaming endpoint
│       ├── hours/verify/[token]/route.ts # supervisor verification link
│       └── credentials/upload/route.ts
├── components/
│   ├── ui/                          # shadcn primitives
│   ├── layout/                      # sidebar, header, mobile nav
│   ├── onboarding/                  # questionnaire steps
│   ├── roadmap/                     # milestone matrix, cards, skill tree
│   ├── certifications/              # age-gate badge, credential vault
│   ├── outreach/                    # cold-email form + preview
│   ├── hours/                       # hours log form, table, PDF export
│   ├── ctso/                        # event directory cards/filters
│   └── shared/                      # xp counter, skeletons, error boundary
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # browser client
│   │   ├── server.ts                # server component / action client
│   │   ├── middleware.ts
│   │   └── admin.ts                 # service-role client, server-only
│   ├── ai/cold-email.ts             # prompt builder + AI SDK call
│   ├── roadmap/
│   │   ├── generate-roadmap.ts      # career track -> milestone templates
│   │   ├── age-rules.ts             # state age-requirement engine
│   │   └── templates/               # per-career seed milestone data
│   ├── validations/                 # Zod schemas (one file per form/model)
│   ├── constants.ts                 # career tracks, categories, grade levels
│   └── utils.ts
├── store/use-app-store.ts           # Zustand: sidebar, onboarding wizard state
├── types/
│   ├── database.types.ts            # generated Supabase types
│   └── roadmap.ts
├── supabase/
│   ├── config.toml
│   └── migrations/
│       └── 0001_init_schema.sql     # this phase's deliverable
└── public/
```

## Database schema (`supabase/migrations/0001_init_schema.sql`)

Six tables, all with RLS enabled:

- **profiles** — one row per user (`user_id` unique FK to `auth.users`);
  career track, grade, location, XP.
- **roadmaps** — one row per generated 4-year plan; the full generated plan
  is also kept as `roadmap_json` for fast reads, with `milestones` as the
  normalized, per-node source of truth.
- **milestones** — individual nodes in the matrix, scoped to a roadmap via
  `roadmap_id`. Ownership for RLS is derived through the parent roadmap's
  `user_id` (no direct `user_id` column here, per the spec).
- **certifications** — shared reference catalog (CNA, CPR, EMT, Phlebotomy,
  etc.) with per-state age rules in `state_rules_json`. Readable by any
  authenticated user; writes are expected to go through the service-role key
  (seeded/managed by admins, not end users).
- **hours_logged** — clinical/volunteer/shadowing hour entries. Includes a
  `verification_token` for the supervisor-verification link flow, since the
  supervisor confirming hours won't have an app account (that endpoint uses
  the service-role client instead of user-scoped RLS).
- **user_credentials** — uploaded certificates/licenses. `is_public` +
  `share_slug` back the public shareable badge feature, allowing anonymous
  `select` only for rows explicitly marked public.

Enums: `grade_level`, `milestone_category`, `milestone_status`,
`hours_category`, `hours_status`.

## Not yet built

Everything past the schema: Next.js app itself, Shadcn setup, auth flow,
dashboard UI, roadmap generation logic, AI endpoint. Next phase on request.
