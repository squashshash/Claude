import { notFound, redirect } from "next/navigation";
import { getFeature, getFeatureCategory } from "@/lib/features/registry";
import { FEATURE_COMPONENTS } from "@/components/features";
import { ComingSoon } from "@/components/features/coming-soon";
import { Badge } from "@/components/ui/badge";

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  mock: "Sample data",
  planned: "Coming soon",
};

// Retired from the feature grid — its UI now lives in the right-side panel
// instead. Redirect rather than 404 for anyone with the old URL bookmarked.
const RETIRED_REDIRECTS: Record<string, string> = {
  "hours-logger": "/dashboard",
};

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (RETIRED_REDIRECTS[slug]) redirect(RETIRED_REDIRECTS[slug]);

  const feature = getFeature(slug);
  if (!feature) notFound();

  const category = getFeatureCategory(slug);
  const Component = FEATURE_COMPONENTS[slug];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">
          {category?.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl font-bold">{feature.title}</h1>
          <Badge variant={feature.status === "live" ? "default" : "locked"}>
            {STATUS_LABEL[feature.status]}
          </Badge>
        </div>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">{feature.blurb}</p>
      </div>
      {Component ? <Component /> : <ComingSoon feature={feature} />}
    </div>
  );
}
