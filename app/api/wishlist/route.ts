import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Wishlist from "@/lib/models/Wishlist";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { userId, productId } = await req.json();

    console.log(
      "[v0] POST /api/wishlist - userId:",
      userId,
      "productId:",
      productId
    ); // Added debug log

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "userId and productId are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.error("[v0] Invalid productId format:", productId);
      return NextResponse.json(
        { error: "Invalid productId format. Expected MongoDB ObjectId." },
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      userId,
      productId: new mongoose.Types.ObjectId(productId),
    });

    if (existing) {
      console.log("[v0] Product already in wishlist");
      return NextResponse.json(
        { message: "Product already in wishlist" },
        { status: 200 }
      );
    }

    // Add to wishlist
    const wishlistEntry = await Wishlist.create({
      userId,
      productId: new mongoose.Types.ObjectId(productId),
    });

    console.log("[v0] Wishlist entry created:", wishlistEntry); // Added success log

    return NextResponse.json(
      { message: "Product added to wishlist", wishlist: wishlistEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error("[v0] Error in POST /api/wishlist:", error); // Added error log
    return NextResponse.json(
      { error: "Server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const wishlistItems = await Wishlist.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ items: wishlistItems }, { status: 200 });
  } catch (error) {
    console.error("[v0] Error in GET /api/wishlist:", error);
    return NextResponse.json(
      { error: "Server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "userId and productId are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid productId format" },
        { status: 400 }
      );
    }

    await Wishlist.deleteOne({
      userId,
      productId: new mongoose.Types.ObjectId(productId),
    });

    return NextResponse.json(
      { message: "Product removed from wishlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Error in DELETE /api/wishlist:", error);
    return NextResponse.json(
      { error: "Server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
