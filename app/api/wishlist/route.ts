// File: app/api/wishlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Wishlist from "@/lib/models/Wishlist";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { userId, productId, slug } = await req.json();

    if (!userId || (!productId && !slug)) {
      return NextResponse.json(
        { error: "userId and productId/slug are required" },
        { status: 400 }
      );
    }

    let resolvedProductId = productId;

    // If productId not provided but slug is
    if (!resolvedProductId && slug) {
      const product = await Product.findOne({ slug }).select("_id");
      if (!product) {
        return NextResponse.json(
          { error: "Product not found for slug: " + slug },
          { status: 404 }
        );
      }
      // ✅ Safely cast ObjectId to string
      resolvedProductId = String(product._id);
    }

    if (!resolvedProductId) {
      return NextResponse.json(
        { error: "Unable to resolve product ID" },
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      userId,
      productId: new mongoose.Types.ObjectId(resolvedProductId),
    });

    if (existing) {
      return NextResponse.json(
        { message: "Product already in wishlist" },
        { status: 200 }
      );
    }

    // Add to wishlist
    const wishlistEntry = await Wishlist.create({
      userId,
      productId: new mongoose.Types.ObjectId(resolvedProductId),
    });

    return NextResponse.json(
      { message: "Product added to wishlist", wishlist: wishlistEntry },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
