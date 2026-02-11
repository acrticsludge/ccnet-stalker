import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  const { id, password } = await req.json();
  const db = await getDB();

  const user = await db.collection("users").findOne({ id });

  if (!user || user.password !== password)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = jwt.sign(
    { userId: user._id.toString(), userid: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );

  return NextResponse.json({ token });
}
