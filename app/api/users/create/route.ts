// app/api/users/create/route.ts
import { type NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";
import { generateJwtToken } from "@/lib/utils/jwt";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { number } = await req.json();
    if (!number) {
      return NextResponse.json(
        { success: false, error: "Phone required" },
        { status: 400 }
      );
    }

    await connectDb();

    let user = await User.findOne({ number });
    if (!user) {
      user = await User.create({ number });
    }

    const token = generateJwtToken({
      userId: user._id.toString(),
      number: user.number,
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
