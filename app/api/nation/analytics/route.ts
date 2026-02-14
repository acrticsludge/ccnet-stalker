import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { protectApi } from "@/lib/apiProtect";
import { normalizeSeries, startOfDay, getBase } from "@/lib/analytics";

export async function GET(req: Request) {
  try {
    protectApi(req);

    const nation = new URL(req.url).searchParams.get("nation")?.trim();

    if (!nation) {
      return NextResponse.json(
        { error: "Missing nation parameter" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const doc = await db.collection("nation_stats_v2").findOne({ nation });

    if (!doc || !Array.isArray(doc.series)) {
      return NextResponse.json({ nation, empty: true });
    }

    const series = normalizeSeries(doc.series);
    console.log("RAW SERIES:", doc.series);
    console.log("NORMALIZED SERIES:", series);

    if (!Array.isArray(series) || series.length === 0) {
      return NextResponse.json({ nation, empty: true });
    }

    const now = startOfDay();

    const ranges = {
      "7d": new Date(now.getTime() - 7 * 864e5),
      "30d": new Date(now.getTime() - 30 * 864e5),
      "1y": new Date(now.getTime() - 365 * 864e5),
    };

    const today = series.at(-1)!.r;

    const base7d = getBase(series, ranges["7d"]);
    const base30d = getBase(series, ranges["30d"]);
    const base1y = getBase(series, ranges["1y"]);

    return NextResponse.json({
      nation,
      today,
      "7d": base7d,
      "30d": base30d,
      "1y": base1y,
      trend: {
        "7d": base7d !== null ? today - base7d : null,
        "30d": base30d !== null ? today - base30d : null,
        "1y": base1y !== null ? today - base1y : null,
      },
      series,
    });
  } catch (err) {
    console.error("Nation analytics error:", err);

    return NextResponse.json(
      { error: "Failed to fetch nation analytics" },
      { status: 500 },
    );
  }
}
