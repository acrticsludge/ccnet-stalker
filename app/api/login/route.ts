export async function POST(req: Request) {
  const body = await req.text();

  const backendRes = await fetch(
    "https://3rvzd8hz-5000.inc1.devtunnels.ms/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body,
    }
  );

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", "no-store");

  // 🔥 THIS IS THE KEY LINE
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    headers.set("set-cookie", setCookie);
  }

  return new Response(await backendRes.text(), {
    status: backendRes.status,
    headers,
  });
}
