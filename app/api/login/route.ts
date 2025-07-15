import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateJwtToken } from "@/lib/utils/jwt";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";

export async function POST(request: Request) {
  try {
    const { phone, email } = await request.json();

    await connectDb();

    // Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone, email });
    } else if (email && user.email !== email) {
      user.email = email;
      await user.save();
    }

    // Generate JWT token
    const token = generateJwtToken({ userId: user._id });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
