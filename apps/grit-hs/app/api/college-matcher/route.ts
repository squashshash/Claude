import { NextResponse } from "next/server";

const SCORECARD_FIELDS = [
  "id",
  "school.name",
  "school.city",
  "school.state",
  "school.ownership",
  "latest.student.size",
  "latest.cost.tuition.in_state",
  "latest.cost.tuition.out_of_state",
  "latest.admissions.admission_rate.overall",
  "latest.earnings.10_yrs_after_entry.median",
].join(",");

function notConfigured() {
  return NextResponse.json(
    {
      error:
        "No College Scorecard API key is configured. Get a free key at api.data.gov and set COLLEGE_SCORECARD_API_KEY.",
    },
    { status: 501 }
  );
}

export async function GET(request: Request) {
  const apiKey = process.env.COLLEGE_SCORECARD_API_KEY;
  if (!apiKey) return notConfigured();

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("q")?.trim();
  const state = searchParams.get("state")?.trim().toUpperCase();

  const upstream = new URL("https://api.data.gov/ed/collegescorecard/v1/schools");
  upstream.searchParams.set("api_key", apiKey);
  upstream.searchParams.set("fields", SCORECARD_FIELDS);
  upstream.searchParams.set("per_page", "20");
  if (name) upstream.searchParams.set("school.name", name);
  if (state) upstream.searchParams.set("school.state", state);

  try {
    const res = await fetch(upstream.toString());
    if (!res.ok) {
      return NextResponse.json(
        { error: `College Scorecard API returned ${res.status}` },
        { status: 502 }
      );
    }
    const body = await res.json();
    return NextResponse.json({ results: body.results ?? [] });
  } catch {
    return NextResponse.json({ error: "Couldn't reach the College Scorecard API." }, { status: 502 });
  }
}
