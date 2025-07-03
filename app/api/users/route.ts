import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { number } = body;

    await dbConnect();

    const user = await User.findOne({ number });
    return NextResponse.json({ exists: !!user });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
