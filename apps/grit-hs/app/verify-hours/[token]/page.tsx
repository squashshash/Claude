"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CATEGORY_LABEL: Record<string, string> = {
  clinical: "Clinical",
  volunteer: "Volunteer",
  shadowing: "Shadowing",
};

interface EntrySummary {
  category: string;
  supervisorName: string;
  hours: number;
  date: string;
  status: string;
}

type ViewState = "loading" | "found" | "not-found" | "confirmed" | "error";

export default function VerifyHoursPage() {
  const params = useParams<{ token: string }>();
  const [entry, setEntry] = useState<EntrySummary | null>(null);
  const [view, setView] = useState<ViewState>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/hours/verify/${params.token}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          setErrorMsg(body.error ?? "This verification link isn't available.");
          setView(res.status === 404 ? "not-found" : "error");
          return;
        }
        setEntry(body.entry);
        setView(body.entry.status === "verified" ? "confirmed" : "found");
      })
      .catch(() => {
        setErrorMsg("Couldn't reach the server.");
        setView("error");
      });
  }, [params.token]);

  const confirm = async () => {
    const res = await fetch(`/api/hours/verify/${params.token}`, { method: "POST" });
    if (res.ok) setView("confirmed");
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" /> Hours Verification
          </CardTitle>
          <CardDescription>Confirming logged hours on behalf of a student.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {view === "loading" && <p className="text-muted-foreground">Loading...</p>}
          {(view === "not-found" || view === "error") && <p className="text-destructive">{errorMsg}</p>}
          {view === "found" && entry && (
            <>
              <div className="flex flex-col gap-1 rounded-md bg-muted/60 p-4 text-sm">
                <p>
                  <span className="text-muted-foreground">Category:</span>{" "}
                  <span className="font-semibold">{CATEGORY_LABEL[entry.category] ?? entry.category}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Hours:</span>{" "}
                  <span className="font-semibold">{entry.hours}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Date:</span>{" "}
                  <span className="font-semibold">{entry.date}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Supervisor on file:</span>{" "}
                  <span className="font-semibold">{entry.supervisorName}</span>
                </p>
              </div>
              <Button onClick={confirm} className="w-fit gap-2">
                <CheckCircle2 className="h-4 w-4" /> Confirm these hours
              </Button>
            </>
          )}
          {view === "confirmed" && (
            <p className="flex items-center gap-2 font-semibold text-primary">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> Hours confirmed. Thank you.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
