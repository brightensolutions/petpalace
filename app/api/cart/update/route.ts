import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart from "@/lib/models/UserCart";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, productId, variantId, packId, quantity, ...rest } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "Missing userId or productId" },
        { status: 400 }
      );
    }

    await dbConnect();
    const cart = await UserCart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ success: true, items: [] });
    }

    const idx = cart.items.findIndex(
      (i: any) =>
        i.productId === productId &&
        (i.variantId || null) === (variantId || null) &&
        (i.packId || null) === (packId || null)
    );

    if (idx === -1) {
      return NextResponse.json({ success: true, items: cart.items });
    }

    if (typeof quantity === "number") {
      if (quantity <= 0) {
        cart.items.splice(idx, 1);
      } else {
        cart.items[idx].quantity = quantity;
      }
    }

    // Optionally allow updating other fields (price/name etc.) if present
    Object.assign(cart.items[idx] || {}, rest);

    await cart.save();
    return NextResponse.json({ success: true, items: cart.items });
  } catch (err) {
    console.error("[v0] PUT /api/cart/update error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update cart item" },
      { status: 500 }
    );
  }
}
