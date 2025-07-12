import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/utils/jwt";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";

interface UserType {
  _id: string;
  number: string;
  email?: string;
  name?: string;
  addresses?: any[];
  pets?: any[];
  // Add more fields as needed
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ authenticated: false });

    const decoded = verifyJwtToken(token);
    await connectDb();

    const user = await User.findById(
      decoded.userId || decoded.id
    ).lean<UserType>();

    if (!user) return NextResponse.json({ authenticated: false });

    const normalizedUser = {
      ...user,
      number: user.number,
    };

    return NextResponse.json({ authenticated: true, user: normalizedUser });
  } catch (error) {
    console.error("Token verify error:", error);
    return NextResponse.json({ authenticated: false });
  }
}
