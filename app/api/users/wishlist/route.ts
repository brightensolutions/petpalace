// app/users/wishlist/route.ts
import { type NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import Wishlist from "@/lib/models/Wishlist";
import Product from "@/lib/models/Product";
import { getUserIdFromRequest } from "@/lib/middleware/verifyToken";

export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDb();

    // Get userId from request (via token/cookie)
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch wishlist items for this user and populate product details
    const wishlist = await Wishlist.find({ userId }).populate(
      "productId",
      "name category price image"
    );

    // Transform response to send product details directly
    const items = wishlist.map((entry) => ({
      _id: entry._id,
      product: entry.productId,
      addedAt: entry.createdAt || entry.updatedAt,
    }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return NextResponse.json(
      { error: "Unable to fetch wishlist" },
      { status: 500 }
    );
  }
}
