// /app/api/users/wishlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import mongoose from "mongoose";
import Wishlist from "@/lib/models/Wishlist";
import Product from "@/lib/models/Product"; // ✅ MUST import Product before populate

export async function GET(req: NextRequest) {
  try {
    console.log("[wishlist] Connecting to database...");
    await connectDb();
    console.log("[wishlist] Database connected");

    // Replace this with your actual auth/session logic
    const userId = "68b7d011461e5bd4e12ef825";

    // Fetch wishlist items for the user and populate product details
    const wishlist = await Wishlist.find({ userId })
      .populate({
        path: "productId", // matches field in Wishlist schema
        model: "Product", // matches mongoose.model name
        select: "name slug main_image base_price mrp category",
      })
      .lean();

    console.log("[wishlist] Fetched items:", wishlist.length);
    return NextResponse.json({ wishlist });
  } catch (error: any) {
    console.error("[wishlist] Error:", error.message);
    return NextResponse.json(
      { error: "Unable to fetch wishlist", details: error.message },
      { status: 500 }
    );
  }
}
