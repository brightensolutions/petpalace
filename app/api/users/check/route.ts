import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";

// Define interface for TypeScript
interface IUser {
  _id: string;
  number: string;
  email?: string;
  role: string;
}

export async function POST(req: NextRequest) {
  try {
    const { number } = await req.json();
    if (!number) {
      return NextResponse.json(
        { error: "Phone number required" },
        { status: 400 }
      );
    }

    await connectDb();

    // Find user and return lean object (plain JS)
    const user = await User.findOne({ number }).lean<IUser>();

    if (!user) {
      return NextResponse.json({ exists: false });
    }

    // Return exists: true and user data
    return NextResponse.json({
      exists: true,
      user: {
        _id: user._id,
        number: user.number,
        email: user.email || "",
        role: user.role,
      },
    });
  } catch (error) {
    console.error("check-phone error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
