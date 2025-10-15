import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";
import ProductVariant from "@/lib/models/ProductVariant";
import Category from "@/lib/models/Category";
import Brand from "@/lib/models/Brand";

interface CategoryDoc {
  _id: any;
  name: string;
  parentId?: any;
}

interface BrandDoc {
  _id: any;
  name: string;
}

// GET - Fetch all products with variants and stock
export async function GET(req: NextRequest) {
  try {
    console.log("[v0] Stock API - Starting request");

    await dbConnect();
    console.log("[v0] Stock API - Database connected");

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";

    console.log("[v0] Stock API - Filters:", { search, category, brand });

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    console.log("[v0] Stock API - Query:", JSON.stringify(query));

    // Fetch products with populated brand and category
    let products;
    try {
      products = await Product.find(query)
        .populate("brand", "name")
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .lean();

      console.log("[v0] Stock API - Found products:", products.length);
    } catch (populateError) {
      console.error("[v0] Stock API - Error populating:", populateError);
      // Try without populate if it fails
      products = await Product.find(query).sort({ createdAt: -1 }).lean();
      console.log(
        "[v0] Stock API - Found products without populate:",
        products.length
      );
    }

    // Fetch variants for each product
    const productsWithVariants = await Promise.all(
      products.map(async (product) => {
        try {
          const variants = await ProductVariant.find({
            product_id: product._id,
          }).lean();

          return {
            ...product,
            _id: product._id.toString(),
            brand:
              typeof product.brand === "object" && product.brand
                ? product.brand
                : { name: "N/A" },
            category:
              typeof product.category === "object" && product.category
                ? product.category
                : { name: "N/A" },
            variants: variants.map((v: any) => ({
              ...v,
              _id: v._id.toString(),
            })),
          };
        } catch (variantError) {
          console.error(
            "[v0] Stock API - Error fetching variants for product:",
            product._id,
            variantError
          );
          return {
            ...product,
            _id: product._id.toString(),
            brand:
              typeof product.brand === "object" && product.brand
                ? product.brand
                : { name: "N/A" },
            category:
              typeof product.category === "object" && product.category
                ? product.category
                : { name: "N/A" },
            variants: [],
          };
        }
      })
    );

    // Fetch all categories and brands for filters
    let categories: CategoryDoc[] = [];
    let brands: BrandDoc[] = [];

    try {
      categories = (await Category.find({})
        .select("_id name parentId")
        .sort({ name: 1 })
        .lean()) as unknown as CategoryDoc[];
      console.log("[v0] Stock API - Categories:", categories.length);
    } catch (catError) {
      console.error("[v0] Stock API - Error fetching categories:", catError);
    }

    try {
      brands = (await Brand.find({})
        .select("_id name")
        .sort({ name: 1 })
        .lean()) as unknown as BrandDoc[];
      console.log("[v0] Stock API - Brands:", brands.length);
    } catch (brandError) {
      console.error("[v0] Stock API - Error fetching brands:", brandError);
    }

    console.log("[v0] Stock API - Returning data successfully");

    return NextResponse.json({
      success: true,
      data: productsWithVariants,
      filters: {
        categories: categories.map((c) => ({ ...c, _id: c._id.toString() })),
        brands: brands.map((b) => ({ ...b, _id: b._id.toString() })),
      },
    });
  } catch (error) {
    console.error("[v0] Stock API - Fatal error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch stock data",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PATCH - Update stock for a variant or pack
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { variantId, packIndex, stock } = body;

    if (!variantId || stock === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // If packIndex is provided, update pack stock
    if (packIndex !== undefined && packIndex !== null) {
      const variant = await ProductVariant.findById(variantId);
      if (!variant) {
        return NextResponse.json(
          { success: false, message: "Variant not found" },
          { status: 404 }
        );
      }

      if (!variant.packs || !variant.packs[packIndex]) {
        return NextResponse.json(
          { success: false, message: "Pack not found" },
          { status: 404 }
        );
      }

      variant.packs[packIndex].stock = stock;
      await variant.save();

      return NextResponse.json({
        success: true,
        message: "Pack stock updated successfully",
        data: variant,
      });
    }

    // Otherwise, update variant stock
    const variant = await ProductVariant.findByIdAndUpdate(
      variantId,
      { stock },
      { new: true }
    );

    if (!variant) {
      return NextResponse.json(
        { success: false, message: "Variant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Stock updated successfully",
      data: variant,
    });
  } catch (error) {
    console.error("[v0] Error updating stock:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update stock" },
      { status: 500 }
    );
  }
}
