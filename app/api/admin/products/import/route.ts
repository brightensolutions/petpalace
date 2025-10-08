import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";
import ProductVariant from "@/lib/models/ProductVariant";
import Category from "@/lib/models/Category";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    const text = await file.text();
    const importData = JSON.parse(text);

    if (!Array.isArray(importData)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file format. Expected an array of products.",
        },
        { status: 400 }
      );
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const item of importData) {
      try {
        // Validate required fields
        if (!item.name || !item.slug) {
          errors.push(`Skipped product: Missing name or slug`);
          errorCount++;
          continue;
        }

        // Check if slug already exists
        const existing = await Product.findOne({ slug: item.slug });
        if (existing) {
          errors.push(`Skipped product "${item.name}": Slug already exists`);
          errorCount++;
          continue;
        }

        // Find category by name if provided
        let categoryId;
        if (item.category) {
          const category = await Category.findOne({ name: item.category });
          categoryId = category?._id;
        }

        // Get next product ID
        const lastDoc = await Product.findOne({}, { id: 1, _id: 0 })
          .sort({ id: -1 })
          .lean<{ id?: number }>();
        const nextId = (lastDoc?.id ?? 0) + 1;

        // Create product
        const product = await Product.create({
          id: nextId,
          name: item.name,
          slug: item.slug,
          description: item.description,
          main_image: item.main_image,
          images: item.images || [],
          category: categoryId,
          base_price: item.base_price || 0,
          mrp: item.mrp || 0,
          stock: item.stock || 0,
          foodType: item.foodType,
          hsnCode: item.hsnCode,
          sku: item.sku,
        });

        // Create variants if provided
        if (item.variants && Array.isArray(item.variants)) {
          const variantDocs = item.variants.map((v: any) => ({
            product_id: product._id,
            type: v.type,
            label: v.label,
            price: v.price || 0,
            stock: v.stock || 0,
            discount_percent: v.discount_percent || 0,
            images: v.images || [],
            sku: v.sku,
            packs: v.packs || [],
          }));

          if (variantDocs.length > 0) {
            await ProductVariant.insertMany(variantDocs);
          }
        }

        successCount++;
      } catch (error: any) {
        errors.push(`Error importing "${item.name}": ${error.message}`);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed: ${successCount} products added, ${errorCount} errors`,
      details: {
        successCount,
        errorCount,
        errors: errors.slice(0, 10), // Return first 10 errors
      },
    });
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to import products" },
      { status: 500 }
    );
  }
}
