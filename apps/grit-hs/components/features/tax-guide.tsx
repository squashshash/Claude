"use client";

import { useState } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Answer = "yes" | "no" | null;

export function TaxGuide() {
  const [owedLastYear, setOwedLastYear] = useState<Answer>(null);
  const [expectToOweThisYear, setExpectToOweThisYear] = useState<Answer>(null);

  const showResult = owedLastYear !== null && expectToOweThisYear !== null;
  const canClaimExempt = owedLastYear === "no" && expectToOweThisYear === "no";

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          Based on IRS Form W-4 and Publication 505. This app doesn&apos;t hardcode this year&apos;s
          exact dollar thresholds since they change annually — check{" "}
          <a
            href="https://www.irs.gov/individuals/your-first-job"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent underline"
          >
            irs.gov/individuals/your-first-job
          </a>{" "}
          for the current standard deduction amount.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Can you write &quot;Exempt&quot; on Form W-4?</CardTitle>
          <CardDescription>
            Two conditions have to both be true — answer honestly, this determines whether federal
            income tax gets withheld from your paycheck.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div>
            <p className="mb-2 text-sm font-medium">Did you owe any federal income tax last year?</p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={owedLastYear === "no" ? "default" : "outline"}
                onClick={() => setOwedLastYear("no")}
              >
                No
              </Button>
              <Button
                type="button"
                size="sm"
                variant={owedLastYear === "yes" ? "default" : "outline"}
                onClick={() => setOwedLastYear("yes")}
              >
                Yes
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">
              Do you expect your total earnings this year to stay under the standard deduction for a
              dependent (so you&apos;d owe $0 in federal income tax again)?
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={expectToOweThisYear === "no" ? "default" : "outline"}
                onClick={() => setExpectToOweThisYear("no")}
              >
                Yes, I&apos;ll stay under it
              </Button>
              <Button
                type="button"
                size="sm"
                variant={expectToOweThisYear === "yes" ? "default" : "outline"}
                onClick={() => setExpectToOweThisYear("yes")}
              >
                No / not sure
              </Button>
            </div>
          </div>

          {showResult && (
            <div
              className={
                "flex items-start gap-3 rounded-lg border p-4 " +
                (canClaimExempt ? "border-primary/40 bg-primary/10" : "border-glass-border/20 bg-background/30")
              }
            >
              {canClaimExempt ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
              <div className="text-sm">
                <p className="font-display font-bold">
                  {canClaimExempt
                    ? "You can likely write \"Exempt\" in Step 4(c) of your W-4."
                    : "You'll need to fill out the standard W-4 (no exemption)."}
                </p>
                <p className="mt-1 text-muted-foreground">
                  Either way, Social Security and Medicare (FICA, 7.65% combined) still come out of
                  every paycheck — federal income tax exemption doesn&apos;t change that. The only
                  exception is if you&apos;re employed by a college you&apos;re enrolled at.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
