export function protectApi(request: Request) {
  const key = request.headers.get("x-api-key");
  if (key !== process.env.MY_API_SECRET) throw new Error("Forbidden");
}
