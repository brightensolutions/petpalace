import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserCart, { type ICartItem } from "@/lib/models/UserCart";
import User from "@/lib/models/User";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};

    if (search) {
      // Search by user email or product name
      const users = await User.find({
        email: { $regex: search, $options: "i" },
      }).select("_id");

      query = {
        $or: [
          { userId: { $in: users.map((u) => String(u._id)) } },
          { "items.name": { $regex: search, $options: "i" } },
        ],
      };
    }

    const carts = await UserCart.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await UserCart.countDocuments(query);

    const userIds = [...new Set(carts.map((cart) => cart.userId))];
    const users = await User.find({ _id: { $in: userIds } })
      .select("_id name email")
      .lean();
    const userMap = new Map(users.map((user) => [String(user._id), user]));

    const cartItems = carts.flatMap((cart) => {
      const user = userMap.get(cart.userId);
      return cart.items.map((item: ICartItem) => ({
        cartId: String(cart._id),
        userId: cart.userId,
        userName: user?.name || "Unknown User",
        userEmail: user?.email || "N/A",
        productId: String(item.productId),
        productName: item.name,
        productImage: item.image,
        variantLabel: item.variantLabel,
        quantity: item.quantity,
        price: item.price,
        brand: item.brand,
        sku: item.sku,
        foodType: item.foodType,
        addedAt: cart.updatedAt,
      }));
    });

    return NextResponse.json({
      items: cartItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching carts:", error);
    return NextResponse.json(
      { error: "Failed to fetch carts" },
      { status: 500 }
    );
  }
}
