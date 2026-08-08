export function ReviewNotice() {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
      <p className="font-semibold text-destructive">
        Draft — not reviewed by a lawyer.
      </p>
      <p className="mt-2 text-muted-foreground">
        This document was written to describe what Grit actually does with data, based on the
        application&apos;s real database schema and code. It is a starting point for a lawyer, not a
        substitute for one. Grit is aimed at high school students, which means it may collect data
        from minors — that triggers obligations under laws like COPPA, FERPA, GDPR, and various US
        state privacy laws that this draft does not attempt to satisfy. Have a qualified attorney
        review and rewrite this before launching publicly or enrolling any school.
      </p>
    </div>
  );
}
