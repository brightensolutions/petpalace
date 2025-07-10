import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import type { JwtPayload } from "@/lib/types/api";

// Get JWT_SECRET but handle missing value gracefully during build
const JWT_SECRET = process.env.JWT_SECRET;

// Only check JWT_SECRET at runtime, not during build
function checkJwtSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable not set");
  }
  return JWT_SECRET;
}

export function signToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  const secret = checkJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

// Export with the expected name for backward compatibility
export const generateJwtToken = signToken;

export function verifyToken(token: string): JwtPayload {
  const secret = checkJwtSecret();
  return jwt.verify(token, secret) as JwtPayload;
}

// Export with the expected name for backward compatibility
export const verifyJwtToken = verifyToken;

export async function getUserFromToken(
  req: NextRequest
): Promise<string | null> {
  try {
    if (!JWT_SECRET) {
      console.error("JWT_SECRET environment variable not set");
      return null;
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded.userId || decoded.id || null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
