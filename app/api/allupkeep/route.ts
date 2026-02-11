import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { verifyJWT } from "@/lib/auth";
import { protectApi } from "@/lib/apiProtect";

export async function GET(req: Request) {
  verifyJWT(req);
  protectApi(req);

  const db = await getDB();

  const docs = await db.collection("upkeep-data").find({}).toArray();

  const day0: any[] = [];
  const day1: any[] = [];
  const day2: any[] = [];

  docs.forEach((n) => {
    if (n.days0) day0.push(...n.days0);
    if (n.days1) day1.push(...n.days1);
    if (n.days2) day2.push(...n.days2);
  });

  return NextResponse.json({ 0: day0, 1: day1, 2: day2 });
}
