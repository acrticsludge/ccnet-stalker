import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.MY_API_SECRET;

  if (!apiKey) {
    console.error(
      "CRITICAL: MY_API_SECRET is not set in environment variables."
    );
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://3rvzd8hz-5000.inc1.devtunnels.ms/allupkeep`,
    {
      headers: {
        "x-api-key": apiKey,
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
