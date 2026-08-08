"use client";

import { useQuery } from "@tanstack/react-query";
import { PartyPopper, Flame, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { AchievementKind } from "@/types/database.types";

interface FeedPost {
  id: string;
  kind: AchievementKind;
  title: string;
  body: string | null;
  createdAt: string;
  isYou: boolean;
  displayName: string;
}

const KIND_ICON: Record<AchievementKind, typeof CheckCircle2> = {
  milestone_completed: CheckCircle2,
  streak_milestone: Flame,
  xp_badge: PartyPopper,
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Open, app-wide feed — see app/api/achievements/route.ts. Identity shown
 * is always a public handle or "A Grit student," never a real name, even
 * though the feed itself is open (not opt-in per-post) per Part B.
 */
export function AchievementFeed() {
  const { data, isLoading } = useQuery<{ posts: FeedPost[] }>({
    queryKey: ["achievements"],
    queryFn: async () => {
      const res = await fetch("/api/achievements");
      if (!res.ok) return { posts: [] };
      return res.json();
    },
    staleTime: 15_000,
  });

  const posts = data?.posts ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grit Feed</CardTitle>
        <CardDescription>Real milestones from real students, app-wide.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {!isLoading && posts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nothing yet — complete a milestone and be the first to show up here.
          </p>
        )}
        {posts.map((post) => {
          const Icon = KIND_ICON[post.kind];
          return (
            <div
              key={post.id}
              className="flex items-start gap-3 rounded-md border border-border-subtle bg-muted/30 p-3"
            >
              <Icon
                className={
                  "mt-0.5 h-4 w-4 shrink-0 " +
                  (post.kind === "xp_badge" ? "text-accent" : "text-primary")
                }
                aria-hidden="true"
              />
              <div className="flex flex-col gap-0.5">
                <p className="text-sm">
                  <span className="font-display font-bold">{post.displayName}</span>{" "}
                  {post.kind === "milestone_completed" && "completed"}
                  {post.kind === "streak_milestone" && "hit a streak:"}
                  {post.kind === "xp_badge" && "—"} <span className="font-medium">{post.title}</span>
                </p>
                {post.body && <p className="text-xs text-muted-foreground">{post.body}</p>}
                <p className="text-[11px] text-muted-foreground">{timeAgo(post.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
