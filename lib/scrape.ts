import { getDB } from "./mongodb";
import { startOfDay } from "./analytics";

/* =====================================================
   MAIN SCRAPE (from your Express server)
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

  const data = await response.json();
  const datalist = Object.values(
    data["sets"]["towny.markerset"]["areas"],
  ) as any[];

  const townsCollection = db.collection("towns");

  const uniqueTowns = new Map();
  const nationData = new Map();
  const upkeepData = new Map();

  function getResidentCount(desc: string) {
    const match = desc.match(/Residents.*?\((\d+)\)/i);
    return match ? parseInt(match[1]) : 0;
  }

  for (const townObj of datalist) {
    const town = townObj.label;
    const desc = townObj.desc;

    if (uniqueTowns.has(town)) continue;

    const bankMatch = desc.match(/Bank.*?\$([\d,]+\.?\d*)/);
    const upkeepMatch = desc.match(/Upkeep.*?\$([\d,]+\.?\d*)/);

    const bank = bankMatch ? parseFloat(bankMatch[1].replace(/,/g, "")) : 0;

    const upkeep = upkeepMatch
      ? parseFloat(upkeepMatch[1].replace(/,/g, ""))
      : 0;

    const daysLeft = upkeep > 0 ? Math.floor(bank / upkeep) : 9999;

    const nationMatch = desc.match(/Member of ([\w\s]+)|Capital of ([\w\s]+)/);

    let nation = "Unknown";
    let isCapital = false;

    if (nationMatch) {
      if (nationMatch[2]) {
        nation = nationMatch[2].trim();
        isCapital = true;
      } else {
        nation = nationMatch[1].trim();
      }
    }

    const mayorMatch = desc.match(/Mayor.*:\s*([^<]+)/i);
    const mayor = mayorMatch ? mayorMatch[1].trim() : "Unknown";

    const residentCount = getResidentCount(desc);

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
            residentCount,
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    });

    /* ----- Nation Build ----- */

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
      nData.towns.push({ name: town, bank, upkeep, days: daysLeft });
      nData.totalResidents += residentCount;

      if (isCapital) nData.leader = mayor;
    }

    /* ----- Upkeep Danger ----- */

    if (daysLeft <= 2) {
      if (!upkeepData.has(nation)) {
        upkeepData.set(nation, { nation, days0: [], days1: [], days2: [] });
      }

      const entry = upkeepData.get(nation);
      const townInfo = { name: town, bank, upkeep, days: daysLeft };

      if (daysLeft === 0) entry.days0.push(townInfo);
      if (daysLeft === 1) entry.days1.push(townInfo);
      if (daysLeft === 2) entry.days2.push(townInfo);
    }
  }

  /* -------- BULK WRITE -------- */

  if (uniqueTowns.size) {
    await townsCollection.bulkWrite([...uniqueTowns.values()]);
  }

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
  }

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
  }
}

/* =====================================================
   ANALYTICS SNAPSHOT (Daily history index)
===================================================== */
export async function AnalyticsIndex() {
  const db = await getDB();
  const today = startOfDay();

  const towns = await db.collection("towns").find({}).toArray();

  if (towns.length) {
    await db.collection("town_analytics").insertMany(
      towns.map((t) => ({
        town: t.name,
        residents: t.residentCount ?? 0,
        timestamp: today,
      })),
    );
  }

  const nations = await db.collection("nations").find({}).toArray();

  if (nations.length) {
    await db.collection("nation_analytics").insertMany(
      nations.map((n) => ({
        nation: n.name,
        residents: n.totalResidents ?? 0,
        timestamp: today,
      })),
    );
  }
}

/* =====================================================
   WEEKLY CLEANUP
===================================================== */

export async function cleanupAnalytics() {
  const db = await getDB();

  const oneYearAgo = new Date(Date.now() - 365 * 864e5);

  await db
    .collection("town_stats")
    .updateMany({}, { $pull: { series: { d: { $lt: oneYearAgo } } } as any });

  await db
    .collection("nation_stats")
    .updateMany({}, { $pull: { series: { d: { $lt: oneYearAgo } } } as any });
}
