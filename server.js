import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import cron from "node-cron";
import { set } from "mongoose";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    db = client.db("ccnet-stalker-data");
  } catch (err) {
    console.error("Failed to connect", err);
    process.exit(1);
  }
}

async function fetchSaveUpdateTownNationAndUpkeepData() {
  await connectDB();

  try {
    await client.connect();
    const db = client.db("ccnet-stalker-data");
    const collection = db.collection("towns");
    console.log("Starting scrape...");

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
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const datalist = Object.values(data["sets"]["towny.markerset"]["areas"]);

    const uniqueTowns = new Map();
    const nationData = new Map();
    const upkeepData = new Map();

    function getResidentCount(desc) {
      const match = desc.match(/Residents.*?\((\d+)\)/i);
      return match ? parseInt(match[1]) : 0;
    }

    for (const towns of datalist) {
      const town = towns.label;
      const descreption = towns.desc;
      if (uniqueTowns.has(town)) {
        continue;
      }
      const bank = descreption
        .match(/Bank.*?\$([\d,]+\.?\d*)/)[1]
        .replace(/,/g, "");
      const upkeepMatch = descreption.match(/Upkeep.*?\$([\d,]+\.?\d*)/);

      const upkeep = upkeepMatch
        ? parseFloat(upkeepMatch[1].replace(/,/g, ""))
        : 0.0;

      const daysLeft = upkeep > 0 ? Math.floor(bank / upkeep) : Infinity;
      const nationMatch = descreption.match(
        /Member of ([\w\s]+)|Capital of ([\w\s]+)/
      );
      const nation = nationMatch
        ? (nationMatch[1] || nationMatch[2]).trim() // .trim() removes extra spaces
        : "Unknown";

      const residentsMatch = descreption.match(
        /Residents \(\d+\)<\/span>: (.*?)\s*</
      );
      let residents = [];
      if (residentsMatch && residentsMatch[1]) {
        residents = residentsMatch[1].split(",").map((name) => name.trim());
      }
      uniqueTowns.set(town, {
        updateOne: {
          filter: { name: town },
          update: {
            $set: {
              town,
              bank,
              upkeep,
              days: daysLeft,
              nation,
              residents,
              updatedAt: new Date(),
            },
          },
          upsert: true,
        },
      });

      const residentCount = getResidentCount(descreption);

      if (nation !== "Unknown") {
        if (!nationData.has(nation)) {
          nationData.set(nation, {
            name: nation,
            towns: [],
            totalResidents: 0,
          });
        }

        const nData = nationData.get(nation);
        nData.towns.push(town);
        nData.totalResidents += residentCount;
      }
      if (daysLeft <= 2) {
        if (!upkeepData.has(nation)) {
          upkeepData.set(nation, {
            nation: nation,
            days0: [], // For 0 days
            days1: [], // For 1 day
            days2: [], // For 2 days
          });
        }

        const nEntry = upkeepData.get(nation);
        const townInfo = {
          name: town,
          bank: bank,
          upkeep: upkeep,
          days: daysLeft,
        };

        if (daysLeft === 0) nEntry.days0.push(townInfo);
        else if (daysLeft === 1) nEntry.days1.push(townInfo);
        else if (daysLeft === 2) nEntry.days2.push(townInfo);
      }
    }
    if (uniqueTowns.size > 0) {
      const operations = Array.from(uniqueTowns.values());

      const result = await collection.bulkWrite(operations);
      console.log(
        `✅ Bulk Write Result: Matched ${result.matchedCount}, Modified ${result.modifiedCount}, Upserted ${result.upsertedCount}`
      );
    } else {
      console.log("⚠️ No towns found to update.");
    }

    if (nationData.size > 0) {
      const nationOps = Array.from(nationData.values()).map((n) => ({
        updateOne: {
          filter: { name: n.name },
          update: {
            $set: {
              name: n.name,
              townCount: n.towns.length,
              towns: n.towns,
              totalResidents: n.totalResidents,
              updatedAt: new Date(),
            },
          },
          upsert: true,
        },
      }));

      const res = await db.collection("nations").bulkWrite(nationOps);
      console.log(
        `✅ Nations Updated: ${res.upsertedCount} new, ${res.modifiedCount} updated.`
      );
    } else {
      console.log("⚠️ No nations found to update.");
    }

    if (upkeepData.size > 0) {
      const upkeepOps = Array.from(upkeepData.values()).map((data) => ({
        updateOne: {
          filter: { nation: data.nation },
          update: {
            $set: {
              days0: data.days0,
              days1: data.days1,
              days2: data.days2,
              updatedAt: new Date(),
            },
          },
          upsert: true,
        },
      }));

      await db.collection("upkeep-data").bulkWrite(upkeepOps);
      console.log(`✅ Upkeep alerts updated for ${upkeepOps.length} nations.`);
    } else {
      console.log("⚠️ No alerts found to update.");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

async function StartServer() {
  await connectDB();
  const app = express();
  const port = 3000;

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Listening port on ${port}`);
  });
}

StartServer();
cron.schedule("*/2 * * * *", () => {
  fetchSaveUpdateTownNationAndUpkeepData();
});

console.log("⏳ Scheduler and Server started: Updating every 2 minutes...");
