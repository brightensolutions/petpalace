import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/utils/jwt";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";

export async function GET() {
  try {
    // ✅ Use 'await cookies()' correctly
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ authenticated: false });

    const decoded = verifyJwtToken(token);
    await connectDb();

    const user = await User.findById(decoded.userId || decoded.id).lean();
    if (!user) return NextResponse.json({ authenticated: false });

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    console.error("Token verify error:", error);
    return NextResponse.json({ authenticated: false });
  }
}
