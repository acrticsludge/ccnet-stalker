import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { verifyJWT } from "@/lib/auth";
import { protectApi } from "@/lib/apiProtect";

export async function GET(req: Request) {
  try {
    verifyJWT(req);
    protectApi(req);

    const nation = new URL(req.url).searchParams.get("nation")?.trim();

    if (!nation) {
      return NextResponse.json(
        { error: "Missing nation parameter" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const getNationUpkeepData = await db.collection("upkeep-data").findOne({
      nation: { $regex: `^${nation}$`, $options: "i" },
    });

    if (!getNationUpkeepData) {
      return NextResponse.json({ error: "Nation not found" }, { status: 404 });
    }

    return NextResponse.json({ getNationUpkeepData });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch nation upkeep" },
      { status: 500 },
    );
  }
}
