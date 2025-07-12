import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export function generateJwtToken(payload: any) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwtToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.verify(token, process.env.JWT_SECRET) as any;
}

export async function getUserFromToken(req: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = verifyJwtToken(token);
    return decoded.userId || decoded.id;
  } catch (error) {
    console.error("getUserFromToken error:", error);
    return null;
  }
}
