import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart from "@/lib/models/UserCart";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, ...item } = body;

    console.log("[v0] Cart add API - userId:", userId);
    console.log("[v0] Cart add API - item:", item);

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    let cart = await UserCart.findOne({ userId });

    if (!cart) {
      console.log("[v0] Creating new cart for user:", userId);
      cart = new UserCart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (cartItem: any) =>
        cartItem.productId === item.productId &&
        cartItem.variantId === item.variantId &&
        cartItem.packId === item.packId
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += item.quantity;
      console.log("[v0] Updated existing item quantity");
    } else {
      // Add new item
      cart.items.push(item);
      console.log("[v0] Added new item to cart");
    }

    await cart.save();
    console.log("[v0] Cart saved to database");

    return NextResponse.json({ success: true, items: cart.items });
  } catch (error) {
    console.error("[v0] Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
