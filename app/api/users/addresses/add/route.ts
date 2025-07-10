import { type NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";
import { getUserFromToken } from "@/lib/utils/jwt";
import type { Address } from "@/lib/types/address";

export async function POST(req: NextRequest) {
  try {
    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    await connectDb();
    const userId = await getUserFromToken(req);
    const addressData = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newAddress: Partial<Address> = {
      ...addressData,
      isDefault: user.addresses.length === 0,
    };

    user.addresses.push(newAddress as Address);
    await user.save();

    return NextResponse.json(user.addresses);
  } catch (error) {
    console.error("addAddress error:", error);
    return NextResponse.json(
      { error: "Unable to add address" },
      { status: 500 }
    );
  }
}
