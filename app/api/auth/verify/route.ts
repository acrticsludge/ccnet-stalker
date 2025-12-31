export async function GET() {
  const res = await fetch(
    "https://3rvzd8hz-5000.inc1.devtunnels.ms/api/auth/verify",
    {
      credentials: "include",
      cache: "no-store",
    }
  );

  return new Response(await res.text(), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
