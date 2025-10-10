import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db/db";
import Bestseller from "@/lib/models/BestSeller";
import Product from "@/lib/models/Product"; // fix Product import path casing to match lowercase filename

export async function GET() {
  try {
    await dbConnect();

    type BestsellerLean = { productId: unknown; order: unknown };

    // Get bestseller entries (ordered and limited)
    const rawBestsellers = (await Bestseller.find()
      .select({ productId: 1, order: 1, _id: 0 })
      .sort({ order: 1 })
      .limit(12)
      .lean()) as unknown as BestsellerLean[];

    const bestsellers: Array<{ productId: string; order: number }> = (
      Array.isArray(rawBestsellers) ? rawBestsellers : []
    ).map((b) => ({
      productId: String(b.productId),
      order: Number((b as any).order ?? 0),
    }));

    // Convert productId strings to ObjectIds for querying products
    const ids = bestsellers
      .map((b) => {
        try {
          return new mongoose.Types.ObjectId(b.productId);
        } catch {
          return null;
        }
      })
      .filter(Boolean) as mongoose.Types.ObjectId[];

    if (ids.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Fetch all matching products
    const products = await Product.find({ _id: { $in: ids } }).lean();

    type OutputProduct = {
      _id: string;
      name: string;
      slug?: string;
      images: string[];
      price: number;
      salePrice?: number;
      variants?: { label: string; price: number; salePrice?: number }[];
    };

    // Ensure main_image is first, avoid duplicates, and map prices for UI
    const normalizedProducts: OutputProduct[] = products.map((p: any) => {
      const gallery = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
      const main = p?.main_image;
      const images = main
        ? [main, ...gallery.filter((u: string) => u !== main)]
        : gallery;

      // Map backend fields -> UI fields
      const price =
        typeof p.mrp === "number"
          ? p.mrp
          : typeof p.price === "number"
          ? p.price
          : 0;
      const salePrice =
        typeof p.base_price === "number"
          ? p.base_price
          : typeof p.salePrice === "number"
          ? p.salePrice
          : undefined;

      const variants =
        Array.isArray(p.variants) && p.variants.length > 0
          ? p.variants.map((v: any) => ({
              label: v.label,
              price: typeof v.price === "number" ? v.price : 0,
              salePrice:
                typeof v.salePrice === "number" ? v.salePrice : undefined,
            }))
          : undefined;

      return {
        _id: p._id?.toString?.() ?? String(p._id),
        name: p.name,
        slug: p.slug,
        images,
        price,
        salePrice,
        variants,
      };
    });

    // Map products by id for O(1) lookup using normalized records
    const productMap = new Map(normalizedProducts.map((p) => [p._id, p]));

    // Preserve bestseller order and only return products that exist
    const data = bestsellers
      .map((b) => productMap.get(b.productId))
      .filter(Boolean);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
