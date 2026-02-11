import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { verifyJWT } from "@/lib/auth";
import { protectApi } from "@/lib/apiProtect";
import { normalizeSeries, getBase, startOfDay } from "@/lib/analytics";

export async function GET(req: Request) {
  try {
    verifyJWT(req);
    protectApi(req);

    const db = await getDB();

    const windowParam =
      new URL(req.url).searchParams.get("window") === "30d" ? "30d" : "7d";

    const days = windowParam === "30d" ? 30 : 7;

    const now = startOfDay();
    const fromDate = new Date(now.getTime() - days * 864e5);

    const [townDocs, nationDocs, townsLive] = await Promise.all([
      db.collection("town_stats_v2").find({}).toArray(),
      db.collection("nation_stats_v2").find({}).toArray(),
      db.collection("towns").find({}).toArray(),
    ]);

    /* ================= NATION METRICS ================= */

    let mostStable: any = null;
    let fastestGrowing: any = null;
    let fastestDeclining: any = null;
    let mostAtRisk: any = null;

    for (const n of nationDocs) {
      const series = normalizeSeries(n.series);
      if (!series.length) continue;

      const today = series.at(-1)!.r;
      const base = getBase(series, fromDate);
      if (base === null) continue;

      const trend = today - base;

      const nationTowns = townsLive.filter((t) => t.nation === n.nation);

      const danger = nationTowns.filter((t) => t.days <= 2).length;

      const avgDays =
        nationTowns.reduce((s, t) => s + t.days, 0) / (nationTowns.length || 1);

      const score = avgDays * 2 + Math.max(0, trend) - danger * 5;

      if (!mostStable || score > mostStable.score)
        mostStable = { nation: n.nation, score: Math.round(score) };

      if (!fastestGrowing || trend > fastestGrowing.change)
        fastestGrowing = { nation: n.nation, change: trend };

      if (!fastestDeclining || trend < fastestDeclining.change)
        fastestDeclining = { nation: n.nation, change: trend };

      if (!mostAtRisk || danger > mostAtRisk.dangerTowns)
        mostAtRisk = { nation: n.nation, dangerTowns: danger };
    }

    /* ================= TOWN METRICS ================= */

    let biggestGrowth: any = null;
    let biggestLoss: any = null;
    let mostVolatile: any = null;
    let closestToBankruptcy: any = null;

    for (const t of townDocs) {
      const series = normalizeSeries(t.series);
      if (!series.length) continue;

      const today = series.at(-1)!.r;
      const base = getBase(series, fromDate);
      const base30 = getBase(series, new Date(now.getTime() - 30 * 864e5));

      if (base === null) continue;

      const trend = today - base;

      const vol =
        Math.abs(trend) + Math.abs(base30 !== null ? today - base30 : 0);

      const live = townsLive.find((x) => x.name === t.town);

      if (!biggestGrowth || trend > biggestGrowth.change)
        biggestGrowth = {
          town: t.town,
          nation: live?.nation ?? "Unknown",
          change: trend,
        };

      if (!biggestLoss || trend < biggestLoss.change)
        biggestLoss = {
          town: t.town,
          nation: live?.nation ?? "Unknown",
          change: trend,
        };

      if (!mostVolatile || vol > mostVolatile.score)
        mostVolatile = { town: t.town, score: vol };

      if (
        live &&
        (!closestToBankruptcy || live.days < closestToBankruptcy.daysLeft)
      )
        closestToBankruptcy = {
          town: t.town,
          nation: live.nation,
          daysLeft: live.days,
        };
    }

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      generatedAt: new Date(),
      window: windowParam,

      nations: {
        mostStable,
        fastestGrowing,
        fastestDeclining,
        mostAtRisk,
      },

      towns: {
        biggestGrowth,
        biggestLoss,
        mostVolatile,
        closestToBankruptcy,
      },

      meta: {
        totalTowns: townsLive.length,
        totalNations: new Set(townsLive.map((t) => t.nation)).size,
        townsInDanger: townsLive.filter((t) => t.days <= 2).length,
      },
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json({ error: "Analytics failed" }, { status: 500 });
  }
}
