import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { verifyJWT } from "@/lib/auth";
import { protectApi } from "@/lib/apiProtect";

export async function GET(req: Request) {
  verifyJWT(req);
  protectApi(req);

  const db = await getDB();
  const data = await db.collection("nations").find({}).toArray();

  return NextResponse.json(data);
}
