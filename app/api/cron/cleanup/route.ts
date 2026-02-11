import { NextResponse } from "next/server";
import { cleanupAnalytics } from "@/lib/scrape";

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await cleanupAnalytics();

  return NextResponse.json({ cleaned: true });
}
