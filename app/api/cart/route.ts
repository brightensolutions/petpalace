import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart from "@/lib/models/UserCart";
import { getUserId } from "@/lib/services/cart-service";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const userId = getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await UserCart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: cart.items });
  } catch (error) {
    console.error("Error getting cart:", error);
    return NextResponse.json({ error: "Failed to get cart" }, { status: 500 });
  }
}
