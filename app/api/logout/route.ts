export async function POST() {
  const backendRes = await fetch(
    "https://3rvzd8hz-5000.inc1.devtunnels.ms/logout",
    {
      method: "POST",
      credentials: "include",
    }
  );

  const headers = new Headers();
  headers.set("Cache-Control", "no-store");

  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    headers.set("set-cookie", setCookie);
  }

  return new Response(null, {
    status: backendRes.status,
    headers,
  });
}
