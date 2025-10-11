import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart from "@/lib/models/UserCart";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      productId,
      variantId,
      packId,
      quantity = 1,
      price,
      name,
      image,
      brand,
      variantLabel,
      sku,
      foodType,
    } = body || {};

    if (!userId || !productId || !name || typeof price !== "number") {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const cart =
      (await UserCart.findOne({ userId })) ||
      (await UserCart.create({ userId, items: [] }));

    const idx = cart.items.findIndex(
      (i: any) =>
        i.productId === productId &&
        (i.variantId || null) === (variantId || null) &&
        (i.packId || null) === (packId || null)
    );

    if (idx > -1) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        variantId,
        packId,
        quantity,
        price,
        name,
        image,
        brand,
        variantLabel,
        sku,
        foodType,
      });
    }

    await cart.save();

    return NextResponse.json({ success: true, items: cart.items });
  } catch (err) {
    console.error("[v0] POST /api/cart/add error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to add to cart" },
      { status: 500 }
    );
  }
}
