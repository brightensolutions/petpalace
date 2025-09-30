import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";
import ProductVariant from "@/lib/models/ProductVariant";
import "@/lib/models/Brand"; // 👈 force-register Brand schema
import "@/lib/models/Category"; // 👈 force-register Category schema

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    await dbConnect();

    const product = await Product.findOne({ slug })
      .populate("brand", "name slug")
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const variants = await ProductVariant.find({
      product_id: (product as any)._id,
    }).lean();

    return NextResponse.json({ ...product, variants });
  } catch (error) {
    console.error("[v0] Error fetching product:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
