// /app/api/users/update/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const { number, email } = await req.json();

    if (!number || !email) {
      return NextResponse.json(
        { success: false, message: "Phone number and email required" },
        { status: 400 }
      );
    }

    await connectDb();

    const user = await User.findOneAndUpdate(
      { number },
      { email },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Email update error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
