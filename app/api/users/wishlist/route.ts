import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import Wishlist from "@/lib/models/Wishlist";
import Product from "@/lib/models/Product";
import { getUserFromToken } from "@/lib/utils/jwt";

export async function GET(req: NextRequest) {
  try {
    const connection = await connectDb();

    // Force model registration by checking connection

    const userId = await getUserFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find wishlist items for the user
    const wishlistEntries = await Wishlist.find({ userId }).lean();

    // Map to include basic product info
    const wishlist = await Promise.all(
      wishlistEntries.map(async (entry) => {
        const product = await Product.findById(entry.productId).lean();

        if (!product) {
          console.warn(`Product ${entry.productId} not found for wishlist`);
          return null;
        }

        return {
          _id: entry._id.toString(),
          productId: entry.productId.toString(),
          name: product.name || "Unknown Product",
          slug: product.slug || "",
          category: product.category?.toString() || "",
          price: product.base_price || 0,
          image:
            product.main_image ||
            "/placeholder.svg?height=100&width=100&text=Product",
          addedAt: entry.createdAt || entry.updatedAt,
        };
      })
    );

    // Filter out null entries
    const filteredWishlist = wishlist.filter((item) => item !== null);

    return NextResponse.json({ wishlist: filteredWishlist });
  } catch (error) {
    console.error("getWishlist error:", error);
    return NextResponse.json(
      {
        error: "Unable to fetch wishlist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const connection = await connectDb();

    const userId = await getUserFromToken(req);
    const { productId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    // Verify product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if already exists
    const exists = await Wishlist.findOne({ userId, productId });
    if (exists) {
      return NextResponse.json({ message: "Already in wishlist" });
    }

    const newEntry = new Wishlist({ userId, productId });
    await newEntry.save();

    return NextResponse.json({
      message: "Added to wishlist",
      wishlist: newEntry,
    });
  } catch (error) {
    console.error("addWishlist error:", error);
    return NextResponse.json(
      {
        error: "Unable to add to wishlist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
