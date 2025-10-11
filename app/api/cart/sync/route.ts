import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart, { type ICartItem } from "@/lib/models/UserCart";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, items } = body || {};

    if (!userId || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Missing userId or items" },
        { status: 400 }
      );
    }

    await dbConnect();

    const cart =
      (await UserCart.findOne({ userId })) ||
      (await UserCart.create({ userId, items: [] }));

    // Merge by productId+variantId+packId
    const keyOf = (i: ICartItem) =>
      `${i.productId}::${i.variantId || ""}::${i.packId || ""}`;

    const map = new Map<string, ICartItem>();
    const existingItems: ICartItem[] = (cart.items as any[]).map((it: any) =>
      typeof it?.toObject === "function" ? it.toObject() : it
    );
    for (const it of existingItems) {
      map.set(keyOf(it), it);
    }

    // incoming
    for (const it of items as ICartItem[]) {
      const k = keyOf(it);
      const existing = map.get(k);
      if (existing) {
        existing.quantity += it.quantity || 1;
        // Keep earliest non-zero price/name/image etc.
        existing.price = existing.price || it.price;
        existing.name = existing.name || it.name;
        existing.image = existing.image || it.image;
        existing.brand = existing.brand || it.brand;
        existing.variantLabel = existing.variantLabel || it.variantLabel;
        existing.sku = existing.sku || it.sku;
        existing.foodType = existing.foodType || it.foodType;
        map.set(k, existing);
      } else {
        map.set(k, {
          productId: it.productId,
          variantId: it.variantId,
          packId: it.packId,
          quantity: Math.max(1, it.quantity || 1),
          price: it.price,
          name: it.name,
          image: it.image,
          brand: it.brand,
          variantLabel: it.variantLabel,
          sku: it.sku,
          foodType: it.foodType,
        });
      }
    }

    cart.items = Array.from(map.values());
    await cart.save();

    return NextResponse.json({ success: true, items: cart.items });
  } catch (err) {
    console.error("[v0] POST /api/cart/sync error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to sync cart" },
      { status: 500 }
    );
  }
}
