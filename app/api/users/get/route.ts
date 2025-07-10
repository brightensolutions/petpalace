// app/api/users/get/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const { number } = await req.json();
    if (!number) {
      return NextResponse.json(
        { success: false, error: "Number is required" },
        { status: 400 }
      );
    }

    await connectDb();

    const user = await User.findOne({ number });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
