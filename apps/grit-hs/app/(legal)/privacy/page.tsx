import type { Metadata } from "next";
import { ReviewNotice } from "@/components/legal/review-notice";

export const metadata: Metadata = {
  title: "Privacy Policy · Grit",
  description: "What data Grit collects, where it is stored, and who can see it.",
};

export default function PrivacyPage() {
  return (
    <article className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-1 text-sm text-muted-foreground">Last updated: 7 August 2026</p>
      </div>

      <ReviewNotice />

      <Section title="Who this is for">
        <p>
          Grit is a high school planning tool. Most of the people using it are between 13 and 18
          years old. If you are under 13, do not create an account — Grit does not currently have a
          verifiable parental consent process, which US law (COPPA) requires for that age group.
        </p>
      </Section>

      <Section title="What we collect">
        <p>Everything below is data you type in or upload yourself. Grit does not buy data, and there is no advertising or tracking network in the app.</p>
        <H3>Account</H3>
        <List
          items={[
            "Email address and password (handled by our authentication provider — we never see the password itself, only a hash they store).",
          ]}
        />
        <H3>Profile</H3>
        <List
          items={[
            "Your name, US state, and ZIP code.",
            "Your grade level, target graduation year, and chosen career pathway.",
            "Your XP total, streak counts, and last-active date.",
            "An optional public handle, if you turn on the public portfolio.",
          ]}
        />
        <H3>Your planning data</H3>
        <List
          items={[
            "Roadmap and milestone progress, including any dates you plan work for.",
            "Clubs, sports, exam dates and scores, class schedule, and assignment reminders.",
            "Volunteer, clinical, and shadowing hours, including notes you write.",
            "Certificates, licenses, and transcripts you upload to the Credential Vault.",
          ]}
        />
        <H3>Signatures and scanned documents</H3>
        <p>
          If you use the hours logger&apos;s signature capture, we store the signature image you (or
          your supervisor) draw. If you photograph a signed paper hours form, we store that image and
          send a copy to an AI provider to read the text off it. Both are kept in private storage —
          see &ldquo;Who can see your data&rdquo; below.
        </p>
      </Section>

      <Section title="Information about other people">
        <p>
          This one is easy to miss, so it gets its own section. Several Grit features ask you to enter
          details about <em>other people</em> — a volunteer supervisor&apos;s name and email address,
          a club advisor&apos;s name, a coach&apos;s name, a teacher&apos;s name. Those people are
          usually adults who have not signed up for Grit and have not agreed to anything.
        </p>
        <p>
          We store that information because the features need it — the hours-verification email, for
          example, has to go somewhere. Only enter details about someone else when it is genuinely
          needed, and be aware that a supervisor you name will receive a verification link that
          identifies you and the hours you logged.
        </p>
      </Section>

      <Section title="Who can see your data">
        <p>
          By default, <strong>everything you enter is visible only to you.</strong> Every table in our
          database has row-level security enforcing that, so one student&apos;s account cannot read
          another&apos;s. There are exactly four ways data leaves that boundary, and three of them
          require you to turn something on:
        </p>
        <List
          items={[
            "Public portfolio (off by default). If you set a handle and switch your portfolio to public, a page at /p/your-handle becomes visible to anyone with the link. It shows your name, pathway, grade, XP, completed milestones, and any credentials you individually marked public. It deliberately never exposes your ZIP code, state, or account ID.",
            "Track leaderboard (off by default). Requires the same public-portfolio opt-in. It shows only your handle and XP total.",
            "Achievement feed (on by default). When you complete a milestone, a short post is added to an app-wide feed that any signed-in Grit user can read. Your real name is never attached — the post shows your public handle if you have set one, otherwise 'A Grit student'.",
            "Hours verification links. When you log hours and enter a supervisor's email, that supervisor gets a link showing the entry so they can confirm it. Anyone holding that link can view that entry.",
          ]}
        />
      </Section>

      <Section title="Services we send data to">
        <List
          items={[
            "Supabase — our database, authentication, and file storage provider. All of your data lives here.",
            "Vercel — hosts the application and processes requests.",
            "Anthropic (Claude) — receives the contents of a scanned hours form when you use the document scanner, and receives prompt text when you use AI roadmap or outreach generation. It does not receive your account data otherwise.",
            "College Scorecard (US Dept. of Education) and Transitland — receive search terms you type (a school name, a ZIP code) when you use those features. They do not receive your identity.",
          ]}
        />
      </Section>

      <Section title="Getting your data out, and deleting it">
        <p>
          From <strong>Settings → Your data</strong> you can download everything Grit holds about you
          as a single JSON file, and you can permanently delete your account. Deletion removes your
          profile, roadmap, milestones, hours, credentials, clubs, sports, exams, schedule, reminders,
          achievement posts, and every file you uploaded. It cannot be undone.
        </p>
        <p>
          We do not currently have an automatic retention limit — data stays until you delete it or
          delete your account.
        </p>
      </Section>

      <Section title="Security">
        <p>
          Traffic is encrypted with HTTPS. Uploaded files go to private storage buckets and are served
          only through short-lived signed links, never public URLs. Database access is restricted
          per-user at the database level rather than only in application code.
        </p>
        <p>
          No system is perfectly secure, and Grit is a small project rather than a company with a
          security team. Please do not upload documents you would be seriously harmed by losing
          control of.
        </p>
      </Section>

      <Section title="Changes and contact">
        <p>
          If this policy changes materially, the &ldquo;last updated&rdquo; date above will change. For
          questions, or to ask for your data or its deletion by hand, contact the operator of this
          Grit instance.
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-foreground">{children}</h3>;
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
