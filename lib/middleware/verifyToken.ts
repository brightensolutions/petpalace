import { type NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/utils/jwt";

export function verifyToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyJwtToken(token);

    return { success: true, userId: decoded.userId || decoded.id };
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// Add the missing export
export function getUserIdFromRequest(req: NextRequest): string | null {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = verifyJwtToken(token);

    return decoded.userId || decoded.id || null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
