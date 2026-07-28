import { NextResponse } from "next/server";

function notConfigured() {
  return NextResponse.json(
    {
      error:
        "No Transitland API key is configured. Get a free key at transit.land/documentation/apikey-registration and set TRANSITLAND_API_KEY.",
    },
    { status: 501 }
  );
}

export async function GET(request: Request) {
  const apiKey = process.env.TRANSITLAND_API_KEY;
  if (!apiKey) return notConfigured();

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const radius = searchParams.get("radius") ?? "1";

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required." }, { status: 400 });
  }

  const upstream = new URL("https://transit.land/api/v2/rest/stops");
  upstream.searchParams.set("lat", lat);
  upstream.searchParams.set("lon", lon);
  upstream.searchParams.set("radius", Math.min(Number(radius) || 1, 10).toString());
  upstream.searchParams.set("apikey", apiKey);
  upstream.searchParams.set("limit", "20");

  try {
    const res = await fetch(upstream.toString());
    if (!res.ok) {
      return NextResponse.json({ error: `Transitland API returned ${res.status}` }, { status: 502 });
    }
    const body = await res.json();
    return NextResponse.json({ stops: body.stops ?? [] });
  } catch {
    return NextResponse.json({ error: "Couldn't reach the Transitland API." }, { status: 502 });
  }
}
