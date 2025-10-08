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

    const { productId, variantId, packId } = await req.json();

    const cart = await UserCart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Remove the item
    cart.items = cart.items.filter(
      (item: any) =>
        !(
          item.productId === productId &&
          item.variantId === variantId &&
          item.packId === packId
        )
    );

    await cart.save();

    return NextResponse.json({ items: cart.items });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove item" },
      { status: 500 }
    );
  }
}
