import type { Metadata } from "next";
import Link from "next/link";
import { ReviewNotice } from "@/components/legal/review-notice";

export const metadata: Metadata = {
  title: "Terms of Service · Grit",
  description: "The rules for using Grit, and the limits of what it promises.",
};

export default function TermsPage() {
  return (
    <article className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Terms of Service</h1>
        <p className="mt-1 text-sm text-muted-foreground">Last updated: 7 August 2026</p>
      </div>

      <ReviewNotice />

      <Section title="What Grit is">
        <p>
          Grit is a planning tool for high school students. It helps you map out a career pathway,
          track milestones, log volunteer and clinical hours, and keep on top of clubs, sports, exams,
          and assignments. It is a personal organiser — it is not a school system of record, and
          nothing in it is an official transcript.
        </p>
      </Section>

      <Section title="Who can use it">
        <p>
          You must be at least 13 years old to create an account. If you are under 18, you should have
          a parent or guardian read these terms with you.
        </p>
        <p>
          You are responsible for keeping your password to yourself and for everything done through
          your account.
        </p>
      </Section>

      <Section title="Grit is not professional advice">
        <p>
          This matters more than the rest of this document, so read it carefully. Grit contains
          information about certification age requirements, youth labour law, tax forms, college
          admissions criteria, and clinical liability rules. All of it is general information
          assembled from public sources, and some of it will be out of date by the time you read it.
        </p>
        <p>
          It is <strong>not</strong> legal advice, medical advice, tax advice, financial advice, or
          professional college counselling. Do not make a decision that matters — about a job, a
          licence, a tax filing, an application deadline — based only on what Grit tells you. Confirm
          it with your school counsellor, the certifying body, the relevant government agency, or a
          qualified professional.
        </p>
        <p>
          Where Grit does not have verified information, it says so and links to the official source
          rather than guessing. Please use those links.
        </p>
      </Section>

      <Section title="Your content">
        <p>
          Everything you enter stays yours. You give us permission to store and display it back to you
          so the app can work, and to share the specific things you choose to share — a public
          portfolio, a leaderboard entry, an hours-verification link. Nothing else is published. See
          the{" "}
          <Link href="/privacy" className="text-primary underline underline-offset-2">
            Privacy Policy
          </Link>{" "}
          for exactly what those cases are.
        </p>
        <p>You can export or permanently delete everything from Settings at any time.</p>
      </Section>

      <Section title="Logging hours honestly">
        <p>
          The hours logger produces records that a supervisor can confirm and that you may later show
          to a college or employer. Do not log hours you did not work, and do not sign on someone
          else&apos;s behalf. Falsifying a verification record can have consequences well beyond this
          app.
        </p>
      </Section>

      <Section title="Things you agree not to do">
        <List
          items={[
            "Try to access another user's account or data.",
            "Upload malware, or content that is illegal or that you have no right to share.",
            "Enter another person's details in order to harass them, or send verification requests to someone who is not genuinely your supervisor.",
            "Scrape, overload, or attempt to disrupt the service.",
            "Impersonate someone else, including on a public portfolio page.",
          ]}
        />
        <p>We may suspend or remove an account that does these things.</p>
      </Section>

      <Section title="Availability and limits">
        <p>
          Grit is provided as-is, with no guarantee that it will be available, error-free, or that your
          data will never be lost. Keep your own copy of anything you cannot afford to lose — the data
          export in Settings exists for exactly this. To the maximum extent the law allows, the
          operator of this Grit instance is not liable for losses arising from your use of it.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          These terms may change. The &ldquo;last updated&rdquo; date at the top will change with them,
          and continuing to use Grit after that means you accept the new version.
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

function List({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
