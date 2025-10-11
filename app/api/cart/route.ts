import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart from "@/lib/models/UserCart";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || null;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    await dbConnect();
    const cart = await UserCart.findOne({ userId });
    return NextResponse.json({
      success: true,
      items: cart?.items || [],
    });
  } catch (err) {
    console.error("[v0] GET /api/cart error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to load cart" },
      { status: 500 }
    );
  }
}
