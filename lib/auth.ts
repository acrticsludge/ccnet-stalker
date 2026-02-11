import jwt from "jsonwebtoken";

export function verifyJWT(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) throw new Error("Unauthorized");

  const token = auth.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET!);
}
