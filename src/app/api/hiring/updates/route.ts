import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { fetchHiringUpdates } from "@/lib/hiring/updates";

export const runtime = "nodejs";

const getCachedHiringUpdates = unstable_cache(
  async () => fetchHiringUpdates(),
  ["hiring-updates"],
  { revalidate: 60 }
);

export async function GET() {
  const items = await getCachedHiringUpdates();
  return NextResponse.json(
    { items },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
