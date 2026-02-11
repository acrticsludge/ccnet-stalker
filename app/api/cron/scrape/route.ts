import { NextResponse } from "next/server";
import {
  fetchSaveUpdateTownNationAndUpkeepData,
  AnalyticsIndex,
} from "@/lib/scrape";

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await fetchSaveUpdateTownNationAndUpkeepData();
  await AnalyticsIndex();

  return NextResponse.json({ success: true });
}
