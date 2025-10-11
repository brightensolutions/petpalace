import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart from "@/lib/models/UserCart";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    const cart = await UserCart.findOne({ userId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return NextResponse.json({ success: true, items: [] });
  } catch (error) {
    console.error("[v0] POST /api/cart/clear error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to clear cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json().catch(() => ({}));
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    const cart = await UserCart.findOne({ userId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return NextResponse.json({ success: true, items: [] });
  } catch (error) {
    console.error("[v0] DELETE /api/cart/clear error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
