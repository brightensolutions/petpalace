import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";
import { getUserFromToken } from "@/lib/utils/jwt";

export async function PUT(req: NextRequest) {
  try {
    await connectDb();
    const userId = await getUserFromToken(req);
    const updateData = await req.json();

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT /api/profile/update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
