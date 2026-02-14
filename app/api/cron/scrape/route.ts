import { NextResponse } from "next/server";
import { fetchSaveUpdateTownNationAndUpkeepData } from "@/lib/scrape";
import { AnalyticsIndex } from "@/lib/scrape";

export async function GET(req: Request) {
  const apiKey = req.headers.get("x-cron-secret");

  if (apiKey !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("🔄 Cron triggered");

    await fetchSaveUpdateTownNationAndUpkeepData();
    await AnalyticsIndex();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ CRON ERROR:", err);

    return NextResponse.json(
      {
        error: err?.message || "Unknown error",
        stack: err?.stack,
      },
      { status: 500 },
    );
  }
}
