import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart from "@/lib/models/UserCart";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    console.log("[v0] Fetching cart for user:", userId);

    const cart = await UserCart.findOne({ userId });

    if (!cart) {
      console.log("[v0] No cart found, returning empty array");
      return NextResponse.json({ success: true, items: [] });
    }

    console.log("[v0] Cart found with", cart.items.length, "items");
    return NextResponse.json({ success: true, items: cart.items });
  } catch (error) {
    console.error("[v0] Error getting cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get cart" },
      { status: 500 }
    );
  }
}
