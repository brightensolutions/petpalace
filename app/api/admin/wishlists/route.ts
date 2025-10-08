import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Wishlist from "@/lib/models/Wishlist";
import { cookies } from "next/headers";

// GET - Fetch user's wishlist
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { authenticated: false, items: [] },
        { status: 401 }
      );
    }

    const query = userId ? { userId } : { sessionId };
    const wishlistItems = await Wishlist.find(query)
      .populate("productId", "name main_image price")
      .lean();

    const items = wishlistItems.map((item: any) => ({
      productId: String(item.productId._id),
      productName: item.productId.name,
      productImage: item.productId.main_image,
      productPrice: item.productId.price,
      addedAt: item.createdAt,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    const wishlistData: any = { productId };
    if (userId) wishlistData.userId = userId;
    if (sessionId) wishlistData.sessionId = sessionId;

    // Check if already exists
    const existing = await Wishlist.findOne(wishlistData);
    if (existing) {
      return NextResponse.json({
        message: "Item already in wishlist",
        items: [],
      });
    }

    await Wishlist.create(wishlistData);

    const query = userId ? { userId } : { sessionId };
    const wishlistItems = await Wishlist.find(query)
      .populate("productId", "name main_image price")
      .lean();

    const items = wishlistItems.map((item: any) => ({
      productId: String(item.productId._id),
      productName: item.productId.name,
      productImage: item.productId.main_image,
      productPrice: item.productId.price,
      addedAt: item.createdAt,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    const query: any = { productId };
    if (userId) query.userId = userId;
    if (sessionId) query.sessionId = sessionId;

    await Wishlist.deleteOne(query);

    const listQuery = userId ? { userId } : { sessionId };
    const wishlistItems = await Wishlist.find(listQuery)
      .populate("productId", "name main_image price")
      .lean();

    const items = wishlistItems.map((item: any) => ({
      productId: String(item.productId._id),
      productName: item.productId.name,
      productImage: item.productId.main_image,
      productPrice: item.productId.price,
      addedAt: item.createdAt,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
