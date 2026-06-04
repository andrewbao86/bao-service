import { NextResponse } from "next/server";
import { fetchHiringUpdates } from "@/lib/hiring/updates";

export const runtime = "nodejs";

export async function GET() {
  const items = await fetchHiringUpdates();
  return NextResponse.json(
    { items },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
