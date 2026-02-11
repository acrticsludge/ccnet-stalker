import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { protectApi } from "@/lib/apiProtect";

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

    const getNationData = await db.collection("nations").findOne({
      name: { $regex: `^${nation}$`, $options: "i" },
    });

    if (!getNationData) {
      return NextResponse.json({ error: "Nation not found" }, { status: 404 });
    }

    return NextResponse.json({ getNationData });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch nation" },
      { status: 500 },
    );
  }
}
