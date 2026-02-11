import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { protectApi } from "@/lib/apiProtect";

export async function GET(req: Request) {
  try {
    protectApi(req);
    const db = await getDB();
    const towns = await db.collection("towns").find({}).toArray();
    return NextResponse.json(towns);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
