import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart from "@/lib/models/UserCart";
import { getUserId } from "@/lib/services/cart-service";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Get user ID from auth (you'll need to implement your auth logic)
    const userId = getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const item = await req.json();

    // Find or create user cart
    let cart = await UserCart.findOne({ userId });

    if (!cart) {
      cart = new UserCart({ userId, items: [] });
    }

    // Check if item already exists
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

    await cart.save();

    return NextResponse.json({ items: cart.items });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
