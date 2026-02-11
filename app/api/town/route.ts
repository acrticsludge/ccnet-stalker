import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { protectApi } from "@/lib/apiProtect";

export async function GET(req: Request) {
  try {
    protectApi(req);

    const town = new URL(req.url).searchParams.get("town")?.trim();

    if (!town) {
      return NextResponse.json(
        { error: "Missing town parameter" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const getTownData = await db.collection("towns").findOne({
      name: { $regex: `^${town}$`, $options: "i" },
    });

    if (!getTownData) {
      return NextResponse.json({ error: "Town not found" }, { status: 404 });
    }

    return NextResponse.json({ getTownData });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch town" },
      { status: 500 },
    );
  }
}
