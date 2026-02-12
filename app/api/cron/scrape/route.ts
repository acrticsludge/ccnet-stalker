import { NextResponse } from "next/server";
import { fetchSaveUpdateTownNationAndUpkeepData } from "@/lib/scrape";
import { AnalyticsIndex } from "@/lib/scrape";

export async function GET(req: Request) {
  const apiKey = req.headers.get("x-cron-secret");

  if (apiKey !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await fetchSaveUpdateTownNationAndUpkeepData();
    await AnalyticsIndex();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cron failed:", err);

    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
