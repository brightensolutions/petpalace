import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart from "@/lib/models/UserCart";
import { getUserId } from "@/lib/services/cart-service";

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const userId = getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, variantId, packId, quantity } = await req.json();

    const cart = await UserCart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Find and update the item
    const itemIndex = cart.items.findIndex(
      (item: any) =>
        item.productId === productId &&
        item.variantId === variantId &&
        item.packId === packId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return NextResponse.json({ items: cart.items });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}
