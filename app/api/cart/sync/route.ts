import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart from "@/lib/models/UserCart";
import { getUserId } from "@/lib/services/cart-service";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const userId = getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    // Find or create user cart
    let cart = await UserCart.findOne({ userId });

    if (!cart) {
      cart = new UserCart({ userId, items: [] });
    }

    // Merge local cart items with server cart
    for (const item of items) {
      const existingItemIndex = cart.items.findIndex(
        (cartItem: any) =>
          cartItem.productId === item.productId &&
          cartItem.variantId === item.variantId &&
          cartItem.packId === item.packId
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        cart.items.push(item);
      }
    }

    await cart.save();

    return NextResponse.json({ items: cart.items });
  } catch (error) {
    console.error("Error syncing cart:", error);
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}
