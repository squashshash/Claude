# Deploying Grit

Two accounts, ~15-20 minutes: a free Supabase project (database + auth +
storage) and a free Vercel project (hosting). Do Supabase first — you need
its keys before you deploy to Vercel.

## Step 1: Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**. Pick any
   name/region/password (the password is for direct Postgres access, not
   needed for this app).
2. Once it's provisioned, go to **Settings → API** and note down three
   values — you'll paste these into Vercel in Step 2:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`
     — keep this one secret, never expose it client-side.
3. Go to the **SQL Editor** and run each file in `supabase/migrations/` **in
   order** — paste the contents of `0001_init_schema.sql`, run it, then
   `0002_...sql`, `0003_...sql`, `0004_...sql`. Each one is idempotent-safe
   to run once; don't skip the order, later ones depend on earlier ones.
   `0003` also creates the `credentials` Storage bucket via SQL — no manual
   Storage UI steps needed.
4. Go to **Authentication → URL Configuration**. You won't know your real
   Vercel domain yet, so leave the defaults for now — **you'll come back to
   this in Step 3** and it matters (skipping it breaks signup-confirmation
   email links and auth redirects in production).

## Step 2: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → **Import Git
   Repository** → pick `squashshash/Claude`.
2. **This repo is a monorepo** — the app isn't at the repo root. Before
   deploying, expand **"Root Directory"** in the import screen and set it
   to `apps/grit-hs`. (If you miss this, the build will fail looking for a
   `package.json` at the repo root.)
3. Framework Preset should auto-detect as **Next.js** — leave build/output
   settings on their defaults.
4. Add environment variables (Vercel's import screen has a paste-many-at-once
   box — you can paste a whole `.env` block):

   **Required** (from Step 1):
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

   **Optional** — each unlocks one specific feature; the app runs fine
   without any of them, those features just show an honest "not
   configured" message instead of crashing:
   ```
   ANTHROPIC_API_KEY=            # live AI cold-outreach generation
   COLLEGE_SCORECARD_API_KEY=    # College Matcher — free key: https://api.data.gov/signup
   TRANSITLAND_API_KEY=          # Transit Planner — free key: https://www.transit.land/documentation/apikey-registration
   ```
5. Click **Deploy**. First build takes 1-3 minutes.

## Step 3: Close the loop — point Supabase Auth at your real domain

This is the one step people forget and then wonder why signup emails link
to `localhost`.

1. Copy your production URL from Vercel (e.g. `https://grit-xyz.vercel.app`,
   or your custom domain if you set one up).
2. Back in Supabase → **Authentication → URL Configuration**:
   - **Site URL**: your production URL.
   - **Redirect URLs**: add your production URL (and `http://localhost:3000`
     too if you still want local dev to work against the same project).
3. Save. Auth flows (signup confirmation, login redirects) now point at the
   real deployment instead of localhost.

## Step 4: Verify it's actually live

Quick checklist, in order:

- [ ] Visiting the deployed URL redirects to `/dashboard` and it loads
      (sample data, since no one's signed up yet).
- [ ] `/signup` creates a real account (check the Supabase **Table
      Editor → auth.users** to confirm the row landed).
- [ ] Complete onboarding — confirms `/api/roadmap/generate` is writing to
      `profiles`/`roadmaps`/`milestones`.
- [ ] Log hours in the Hours Logger, refresh the page — confirms it's
      reading back from `/api/hours` instead of falling back to sample
      data (the badge should say **"Your data"**, not "Sample data").
- [ ] Upload a credential in the Credential Vault — confirms Storage/RLS
      from migration `0003` is working.
- [ ] If you added `COLLEGE_SCORECARD_API_KEY` / `TRANSITLAND_API_KEY`,
      confirm those two features return real results instead of the
      "not configured" message.

If any of those show sample data when they shouldn't, double check the
Vercel env vars are set for the **Production** environment (not just
Preview) and redeploy — env var changes don't apply to already-built
deployments.

## Optional: custom domain

Vercel → your project → **Settings → Domains** → add your domain, follow
the DNS instructions it gives you. Remember to update Supabase's Site
URL/Redirect URLs (Step 3) again if you add one after initially deploying.

## What still won't be "real" even after this

Per `CLAUDE.md`'s Round 5/6 notes, a handful of registry features are
intentionally still "coming soon" (`status: "planned"`) because building
them honestly needs real data this project doesn't have sourced yet —
that's independent of deployment and won't change just by going live.
