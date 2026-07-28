"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Award, GraduationCap, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CAREER_TRACK_LABELS,
  GRADE_LEVEL_LABELS,
  MILESTONE_CATEGORY_LABELS,
  MILESTONE_CATEGORIES,
  type CareerTrack,
  type GradeLevel,
  type MilestoneCategory,
} from "@/lib/constants";

interface PortfolioMilestone {
  title: string;
  category: MilestoneCategory;
  grade_level: GradeLevel;
}

interface PortfolioCredential {
  cert_name: string;
  issue_date: string | null;
}

interface Portfolio {
  fullName: string | null;
  targetCareer: CareerTrack | null;
  currentGrade: GradeLevel | null;
  targetGraduationYear: number | null;
  xpPoints: number;
  milestones: PortfolioMilestone[];
  credentials: PortfolioCredential[];
}

type ViewState = "loading" | "found" | "not-found" | "error";

export default function PublicPortfolioPage() {
  const params = useParams<{ handle: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [view, setView] = useState<ViewState>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/portfolio/${params.handle}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          setErrorMsg(body.error ?? "This portfolio isn't available.");
          setView(res.status === 404 ? "not-found" : "error");
          return;
        }
        setPortfolio(body);
        setView("found");
      })
      .catch(() => {
        setErrorMsg("Couldn't reach the server.");
        setView("error");
      });
  }, [params.handle]);

  return (
    <div className="flex min-h-dvh justify-center bg-background px-4 py-16">
      <div className="w-full max-w-2xl">
        {view === "loading" && <p className="text-center text-muted-foreground">Loading...</p>}
        {(view === "not-found" || view === "error") && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">{errorMsg}</CardContent>
          </Card>
        )}
        {view === "found" && portfolio && (
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{portfolio.fullName ?? "Grit Student"}</CardTitle>
                <CardDescription className="text-base">
                  {portfolio.currentGrade && GRADE_LEVEL_LABELS[portfolio.currentGrade]}
                  {portfolio.targetCareer && ` · ${CAREER_TRACK_LABELS[portfolio.targetCareer]} Track`}
                  {portfolio.targetGraduationYear && ` · Class of ${portfolio.targetGraduationYear}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
                <Badge variant="accent">{portfolio.xpPoints.toLocaleString()} XP</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-accent" aria-hidden="true" />
                  <CardTitle>Completed milestones</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {portfolio.milestones.length === 0 && (
                  <p className="text-sm text-muted-foreground">No completed milestones yet.</p>
                )}
                {MILESTONE_CATEGORIES.map((category) => {
                  const items = portfolio.milestones.filter((m) => m.category === category);
                  if (items.length === 0) return null;
                  return (
                    <div key={category}>
                      <p className="font-display text-sm font-bold uppercase tracking-wide text-primary">
                        {MILESTONE_CATEGORY_LABELS[category]}
                      </p>
                      <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
                        {items.map((m) => (
                          <li key={m.title}>{m.title}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {portfolio.credentials.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-accent" aria-hidden="true" />
                    <CardTitle>Credentials</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {portfolio.credentials.map((c) => (
                    <Badge key={c.cert_name} variant="outline">
                      {c.cert_name}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            <p className="text-center text-xs text-muted-foreground">Built with Grit</p>
          </div>
        )}
      </div>
    </div>
  );
}
