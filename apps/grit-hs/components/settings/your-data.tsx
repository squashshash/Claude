"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CONFIRM_PHRASE = "DELETE MY ACCOUNT";

export function YourData({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteAccount() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: phrase }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Couldn't delete your account");
      }
      await createClient().auth.signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your data</CardTitle>
        <CardDescription>
          Download everything Grit holds about you, or delete your account for good.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Your export is a single JSON file — profile, roadmap, hours, clubs, sports, exams,
            schedule, and reminders.
          </p>
          <Button asChild variant="outline" disabled={!enabled}>
            <a href="/api/account/export" download>
              Download my data
            </a>
          </Button>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
          <div>
            <p className="text-sm font-semibold text-destructive">Delete account</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This permanently removes your profile, roadmap, milestones, logged hours, uploaded
              credentials, signatures, scanned forms, and everything in the Life Panel. It cannot be
              undone — download your data first if you want a copy.
            </p>
          </div>

          {!confirming ? (
            <Button
              type="button"
              variant="outline"
              disabled={!enabled}
              className="self-start border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={() => setConfirming(true)}
            >
              Delete my account
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <label htmlFor="confirm-phrase" className="text-sm text-muted-foreground">
                Type <span className="font-mono font-semibold text-destructive">{CONFIRM_PHRASE}</span> to
                confirm.
              </label>
              <Input
                id="confirm-phrase"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder={CONFIRM_PHRASE}
                autoComplete="off"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setConfirming(false);
                    setPhrase("");
                    setError(null);
                  }}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={deleteAccount}
                  disabled={deleting || phrase !== CONFIRM_PHRASE}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? "Deleting..." : "Permanently delete"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          See the{" "}
          <Link href="/privacy" className="text-primary underline underline-offset-2">
            Privacy Policy
          </Link>{" "}
          for what each of these covers.
        </p>
      </CardContent>
    </Card>
  );
}
