import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Bestseller from "@/lib/models/BestSeller";
import Product from "@/lib/models/Product";

// GET - Fetch bestseller products
export async function GET() {
  try {
    await dbConnect();

    const bestsellers = await Bestseller.find().sort({ order: 1 });
    const productIds = bestsellers.map((b) => b.productId);

    const products = await Product.find({ _id: { $in: productIds } })
      .populate("category")
      .populate("brand")
      .lean();

    // Sort products by bestseller order
    const sortedProducts = productIds
      .map((id) => products.find((p) => p._id.toString() === id))
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      data: bestsellers,
      products: sortedProducts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Save bestseller products
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { products } = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { success: false, error: "Products must be an array" },
        { status: 400 }
      );
    }

    // Delete all existing bestsellers
    await Bestseller.deleteMany({});

    // Create new bestsellers with order
    const bestsellers = products.map((productId, index) => ({
      productId,
      order: index,
    }));

    await Bestseller.insertMany(bestsellers);

    return NextResponse.json({
      success: true,
      message: "Bestsellers updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
