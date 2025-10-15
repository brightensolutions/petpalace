import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Wishlist from "@/lib/models/Wishlist";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    let query: any = {};

    if (search) {
      const users = await User.find({
        $or: [
          { email: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const products = await Product.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      query = {
        $or: [
          { userId: { $in: users.map((u) => String(u._id)) } },
          { productId: { $in: products.map((p) => p._id) } },
        ],
      };
    }

    const wishlists = await Wishlist.find(query)
      .populate("productId", "name main_image base_price mrp")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Wishlist.countDocuments(query);

    const userIds = [
      ...new Set(wishlists.map((w: any) => w.userId).filter(Boolean)),
    ];
    const users = await User.find({ _id: { $in: userIds } })
      .select("_id name email")
      .lean();
    const userMap = new Map(users.map((user) => [String(user._id), user]));

    const wishlistItems = wishlists.map((wishlist: any) => {
      const user = wishlist.userId ? userMap.get(wishlist.userId) : null;
      return {
        wishlistId: String(wishlist._id),
        userId: wishlist.userId || "Guest",
        sessionId: wishlist.sessionId || null,
        userName: user?.name || "Guest User",
        userEmail: user?.email || "N/A",
        productId: String(wishlist.productId._id),
        productName: wishlist.productId.name,
        productImage: wishlist.productId.main_image,
        productPrice:
          wishlist.productId.base_price || wishlist.productId.mrp || 0,
        addedAt: wishlist.createdAt,
      };
    });

    return NextResponse.json({
      items: wishlistItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlists" },
      { status: 500 }
    );
  }
}
