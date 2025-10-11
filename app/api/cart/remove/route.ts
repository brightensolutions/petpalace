import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart from "@/lib/models/UserCart";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId, productId, variantId, packId } = body || {};

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "Missing userId or productId" },
        { status: 400 }
      );
    }

    await dbConnect();
    const cart = await UserCart.findOne({ userId });
    if (!cart) return NextResponse.json({ success: true, items: [] });

    const idx = cart.items.findIndex(
      (i: any) =>
        i.productId === productId &&
        (i.variantId || null) === (variantId || null) &&
        (i.packId || null) === (packId || null)
    );

    if (idx > -1) {
      cart.items.splice(idx, 1);
      await cart.save();
    }

    return NextResponse.json({ success: true, items: cart.items });
  } catch (err) {
    console.error("[v0] DELETE /api/cart/remove error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to remove item" },
      { status: 500 }
    );
  }
}
