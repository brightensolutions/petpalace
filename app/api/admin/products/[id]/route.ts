import { NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import Product from "@/lib/models/Product";
import ProductVariant from "@/lib/models/ProductVariant";
import mongoose from "mongoose";

// Helpers
function toObjectId(id: string) {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return null;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const idOrSlug = params.id;
    const byId = toObjectId(idOrSlug);
    const rawProduct = byId
      ? await Product.findById(byId).lean()
      : await Product.findOne({ slug: idOrSlug }).lean();

    if (!rawProduct || Array.isArray(rawProduct)) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const product: any = rawProduct;
    // Load variants separately (avoid strictPopulate issues)
    const variants = await ProductVariant.find({
      product_id: product._id,
    }).lean();

    // Map product to shape the edit page tolerates
    const data = {
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      base_price: product.base_price ?? product.price, // compat
      mrp: product.mrp,
      stock: product.stock ?? 0,
      additional_info: product.additional_info || "",

      main_image: product.main_image || null,
      // edit page expects "gallery_images"; our schema uses "images"
      gallery_images: Array.isArray(product.images) ? product.images : [],

      // edit accepts either arrays or single
      categories: product.category ? [product.category] : [],
      category: product.category || null,
      brands: product.brand ? [product.brand] : [],
      brand: product.brand || null,

      variants: variants.map((v: any) => {
        if (v.type === "weight") {
          return {
            type: v.type,
            label: v.label,
            weight_value: v.weightValue ?? v.weight_value, // compat if present
            packs: (v.packs || []).map((p: any) => ({
              label: p.label,
              // edit page expects price_per_unit; our schema uses price
              price_per_unit: p.price ?? 0,
              stock: p.stock ?? 0,
              discount_percent: p.discount_percent ?? 0,
            })),
            image:
              Array.isArray(v.images) && v.images[0] ? v.images[0] : undefined,
          };
        }
        return {
          type: v.type,
          label: v.label,
          price: v.price ?? 0,
          stock: v.stock ?? 0,
          discount_percent: v.discount_percent ?? 0,
          image:
            Array.isArray(v.images) && v.images[0] ? v.images[0] : undefined,
        };
      }),
    };

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const id = toObjectId(params.id);
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid product id" },
        { status: 400 }
      );
    }

    const form = await req.formData();

    // Basic mappings from form fields to model
    const name = (form.get("name") as string) || "";
    const slug = (form.get("slug") as string) || "";
    const description = (form.get("description") as string) || "";
    const additional_info = (form.get("additional_info") as string) || "";
    const base_price = Number(form.get("price") || 0);
    const mrp = Number(form.get("mrp") || 0);
    const stock = Number(form.get("stock") || 0);

    // Categories & brands (multiple values)
    const categories = form.getAll("categories").map(String);
    const brands = form.getAll("brands").map(String);

    // Images
    const existingGalleryImages = form
      .getAll("existingGalleryImages")
      .map(String);
    // We ignore new uploads in this implementation. If needed, integrate Vercel Blob later.
    // const mainImageFile = form.get("mainImage") as File | null
    // const galleryImageFiles = form.getAll("galleryImages") as File[]

    // Build update payload
    const update: any = {
      name,
      slug,
      description,
      additional_info,
      base_price,
      mrp,
      stock,
      // Keep existing main_image unless you wire uploads
      // main_image: keep as is
      images: existingGalleryImages, // preserve current gallery ordering
    };

    // Single refs (store first if provided)
    if (categories.length > 0) update.category = categories[0];
    if (brands.length > 0) update.brand = brands[0];

    // Update product
    const updated = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Handle variants: clear and re-create based on form arrays
    await ProductVariant.deleteMany({ product_id: id });

    // Parse variant entries from form
    // We inspect keys like variants[0][type], variants[0][label], etc.
    const variantIndices = new Set<number>();
    for (const key of Array.from(form.keys())) {
      const m = key.match(/^variants\[(\d+)\]\[(.+?)\]/);
      if (m) variantIndices.add(Number(m[1]));
    }

    for (const vi of Array.from(variantIndices).sort((a, b) => a - b)) {
      const get = (k: string) => form.get(`variants[${vi}][${k}]`);
      const type = String(get("type") || "custom");
      const label = String(get("label") || "");
      const variantDoc: any = {
        product_id: id,
        type,
        label,
      };

      if (type === "weight") {
        const weightValue = Number(get("weight_value") || 0);
        variantDoc.weight_value = weightValue;

        // Collect pack indices
        const packIndices = new Set<number>();
        for (const key of Array.from(form.keys())) {
          const m = key.match(
            new RegExp(`^variants\\[${vi}\\]\\[packs\\]\\[(\\d+)\\]`)
          );
          if (m) packIndices.add(Number(m[1]));
        }
        variantDoc.packs = Array.from(packIndices)
          .sort((a, b) => a - b)
          .map((pi) => {
            const getP = (k: string) =>
              form.get(`variants[${vi}][packs][${pi}][${k}]`);
            return {
              label: String(getP("label") || "Pack"),
              price: Number(getP("price_per_unit") || 0),
              stock: Number(getP("stock") || 0),
              discount_percent: Number(getP("discount_percent") || 0),
            };
          });
      } else {
        variantDoc.price = Number(get("price") || 0);
        variantDoc.stock = Number(get("stock") || 0);
        variantDoc.discount_percent = Number(get("discount_percent") || 0);
      }

      // Images for variant
      const existingVariantImage = form.get(`variants[${vi}][existing_image]`);
      if (existingVariantImage) {
        variantDoc.images = [String(existingVariantImage)];
      }

      await ProductVariant.create(variantDoc);
    }

    return NextResponse.json({ success: true, message: "Product updated" });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const id = toObjectId(params.id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid product id" },
        { status: 400 }
      );
    }

    // First, delete all associated variants
    await ProductVariant.deleteMany({ product_id: id });

    // Then delete the product itself
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e: any) {
    console.error("[v0] DELETE product error:", e);
    return NextResponse.json(
      { success: false, message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
