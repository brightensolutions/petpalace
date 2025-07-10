import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const { number } = await req.json();
    if (!number)
      return NextResponse.json(
        { error: "Phone number required" },
        { status: 400 }
      );

    await connectDb();
    const user = await User.findOne({ number });
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("check-phone error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
