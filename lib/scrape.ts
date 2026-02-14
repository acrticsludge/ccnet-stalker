import { getDB } from "./mongodb";
import { startOfDay } from "./analytics";

/* =====================================================
   MAIN SCRAPE
===================================================== */
export async function fetchSaveUpdateTownNationAndUpkeepData() {
  const db = await getDB();

  const response = await fetch(
    "https://map.ccnetmc.com/nationsmap/tiles/_markers_/marker_world.json",
    {
      method: "GET",
      headers: {
        "User-Agent": "CCNet Stalker Upkeep Bot",
        Accept: "application/json, text/javascript, */*; q=0.01",
        Referer: "https://map.ccnetmc.com/nationsmap/",
        "Sec-Fetch-Site": "same-origin",
      },
    },
  );

  if (!response.ok) {
    console.error("Scrape failed:", response.status);
    return;
  }

  const data = await response.json();
  const datalist = Object.values(
    data?.sets?.["towny.markerset"]?.areas || {},
  ) as any[];

  const townsCollection = db.collection("towns");

  const uniqueTowns = new Map<string, any>();
  const nationData = new Map<string, any>();
  const upkeepData = new Map<string, any>();

  function cleanHTML(html: string) {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?[^>]+>/g, "")
      .replace(/\r/g, "")
      .trim();
  }

  function getResidentCount(text: string) {
    const match = text.match(/Residents\s*\((\d+)\)/i);
    return match ? parseInt(match[1]) : 0;
  }

  for (const townObj of datalist) {
    const town = townObj?.label;
    const rawDesc = townObj?.desc;

    if (!town || !rawDesc) continue;
    if (uniqueTowns.has(town)) continue;

    const desc = cleanHTML(rawDesc);

    /* ---------- Economy ---------- */

    const bankMatch = desc.match(/Bank.*?\$([\d,]+\.?\d*)/i);
    const upkeepMatch = desc.match(/Upkeep.*?\$([\d,]+\.?\d*)/i);

    const bank = bankMatch ? parseFloat(bankMatch[1].replace(/,/g, "")) : 0;

    const upkeep = upkeepMatch
      ? parseFloat(upkeepMatch[1].replace(/,/g, ""))
      : 0;

    const daysLeft = upkeep > 0 ? Math.floor(bank / upkeep) : 9999;

    /* ---------- Nation ---------- */

    const nationMatch = desc.match(
      /Member of\s+([^\n]+)|Capital of\s+([^\n]+)/i,
    );

    let nation = "Unknown";
    let isCapital = false;

    if (nationMatch) {
      if (nationMatch[2]) {
        nation = nationMatch[2].trim();
        isCapital = true;
      } else if (nationMatch[1]) {
        nation = nationMatch[1].trim();
      }
    }

    /* ---------- Mayor ---------- */

    const mayorMatch = desc.match(/Mayor:\s*([^\n]+)/i);
    const mayor = mayorMatch ? mayorMatch[1].trim() : "Unknown";

    /* ---------- Residents ---------- */

    const residentsMatch = desc.match(/Residents\s*\(\d+\):\s*([^\n]+)/i);

    const residents = residentsMatch
      ? residentsMatch[1]
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean)
      : [];

    const residentCount = getResidentCount(desc);

    /* ---------- Town Bulk ---------- */

    uniqueTowns.set(town, {
      updateOne: {
        filter: { name: town },
        update: {
          $set: {
            name: town,
            mayor,
            bank,
            upkeep,
            days: daysLeft,
            nation,
            residents,
            residentCount,
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    });

    /* ---------- Nation Build ---------- */

    if (nation !== "Unknown") {
      if (!nationData.has(nation)) {
        nationData.set(nation, {
          name: nation,
          leader: "Unknown",
          towns: [],
          totalResidents: 0,
        });
      }

      const nData = nationData.get(nation);

      nData.towns.push({
        name: town,
        bank,
        upkeep,
        days: daysLeft,
      });

      nData.totalResidents += residentCount;

      if (isCapital) nData.leader = mayor;
    }

    /* ---------- Upkeep Danger ---------- */

    if (daysLeft <= 2) {
      if (!upkeepData.has(nation)) {
        upkeepData.set(nation, {
          nation,
          days0: [],
          days1: [],
          days2: [],
        });
      }

      const entry = upkeepData.get(nation);
      const townInfo = { name: town, bank, upkeep, days: daysLeft };

      if (daysLeft === 0) entry.days0.push(townInfo);
      if (daysLeft === 1) entry.days1.push(townInfo);
      if (daysLeft === 2) entry.days2.push(townInfo);
    }
  }

  /* ===============================
     WRITE TOWNS
  =============================== */

  if (uniqueTowns.size) {
    await townsCollection.bulkWrite([...uniqueTowns.values()]);

    const liveNames = Array.from(uniqueTowns.keys());

    await townsCollection.deleteMany({
      name: { $nin: liveNames },
    });
  }

  /* ===============================
     WRITE NATIONS
  =============================== */

  if (nationData.size) {
    await db.collection("nations").bulkWrite(
      [...nationData.values()].map((n) => ({
        updateOne: {
          filter: { name: n.name },
          update: { $set: { ...n, updatedAt: new Date() } },
          upsert: true,
        },
      })),
    );

    const liveNations = Array.from(nationData.keys());

    await db.collection("nations").deleteMany({
      name: { $nin: liveNations },
    });
  }

  /* ===============================
     WRITE UPKEEP
  =============================== */

  if (upkeepData.size) {
    await db.collection("upkeep-data").bulkWrite(
      [...upkeepData.values()].map((n) => ({
        updateOne: {
          filter: { nation: n.nation },
          update: { $set: { ...n, updatedAt: new Date() } },
          upsert: true,
        },
      })),
    );

    const dangerous = Array.from(upkeepData.keys());

    await db.collection("upkeep-data").deleteMany({
      nation: { $nin: dangerous },
    });
  } else {
    await db.collection("upkeep-data").deleteMany({});
  }
}

/* =====================================================
   ANALYTICS SNAPSHOT (V2 SERIES)
===================================================== */
export async function AnalyticsIndex() {
  const db = await getDB();
  const today = startOfDay();

  /* =========================
     TOWN ANALYTICS
  ========================= */

  const towns = await db.collection("towns").find({}).toArray();

  if (towns.length) {
    await db.collection("town_stats_v2").bulkWrite(
      towns.map((t) => ({
        updateOne: {
          filter: { town: t.name },
          update: {
            $setOnInsert: {
              town: t.name,
            },
            $push: {
              series: {
                $each: [
                  {
                    d: today,
                    r: Number.isFinite(t.residentCount) ? t.residentCount : 0,
                  },
                ],
                $slice: -365,
              },
            },
            $set: {
              updatedAt: new Date(),
            },
          } as any,
          upsert: true,
        },
      })),
    );
  }

  /* =========================
     NATION ANALYTICS
  ========================= */

  const nations = await db.collection("nations").find({}).toArray();

  if (nations.length) {
    await db.collection("nation_stats_v2").bulkWrite(
      nations.map((n) => ({
        updateOne: {
          filter: { nation: n.name },
          update: {
            $setOnInsert: {
              nation: n.name,
            },
            $push: {
              series: {
                $each: [
                  {
                    d: today,
                    r: Number.isFinite(n.totalResidents) ? n.totalResidents : 0,
                  },
                ],
                $slice: -365,
              },
            },
            $set: {
              updatedAt: new Date(),
            },
          } as any,
          upsert: true,
        },
      })),
    );
  }
}
