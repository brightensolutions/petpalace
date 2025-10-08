import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart from "@/lib/models/UserCart";
import { getUserId } from "@/lib/services/cart-service";

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const userId = getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await UserCart.findOne({ userId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return NextResponse.json({ items: [] });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
