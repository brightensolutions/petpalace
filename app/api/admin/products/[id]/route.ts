import { NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import Product from "@/lib/models/Product";
import ProductVariant from "@/lib/models/ProductVariant";
import mongoose from "mongoose";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Helpers
function toObjectId(id: string) {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return null;
  }
}

async function saveUploadedFile(file: File, prefix = ""): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${prefix}${timestamp}-${randomStr}.${ext}`;

  // Ensure public/products directory exists
  const productsDir = join(process.cwd(), "public", "products");
  await mkdir(productsDir, { recursive: true });

  // Save file
  const filepath = join(productsDir, filename);
  await writeFile(filepath, buffer);

  // Return relative path for database storage
  return `/products/${filename}`;
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
      foodType: product.foodType || "",
      hsnCode: product.hsnCode || "",
      sku: product.sku || "",

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
              sku: p.sku || "",
            })),
            image:
              Array.isArray(v.images) && v.images[0] ? v.images[0] : undefined,
            sku: v.sku || "",
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
          sku: v.sku || "",
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
    const foodTypeRaw = form.get("foodType");
    const foodType =
      foodTypeRaw === "veg" || foodTypeRaw === "non-veg"
        ? foodTypeRaw
        : undefined;
    const hsnCode = String(form.get("hsnCode") || "").trim() || undefined;
    const sku = String(form.get("sku") || "").trim() || undefined;

    // Categories & brands (multiple values)
    const categories = form.getAll("categories").map(String);
    const brands = form.getAll("brands").map(String);

    const existingGalleryImages = form
      .getAll("existingGalleryImages")
      .map(String);

    // Handle main image upload
    let main_image: string | undefined;
    const mainImageFile = form.get("mainImage") as File | null;
    if (mainImageFile && mainImageFile.size > 0) {
      main_image = await saveUploadedFile(mainImageFile, "main-");
    }

    // Handle gallery image uploads
    const galleryImageFiles = form.getAll("galleryImages") as File[];
    const newGalleryImages: string[] = [];
    for (const file of galleryImageFiles) {
      if (file && file.size > 0) {
        const path = await saveUploadedFile(file, "gallery-");
        newGalleryImages.push(path);
      }
    }
    const allGalleryImages = [...existingGalleryImages, ...newGalleryImages];

    // Build update payload
    const update: any = {
      name,
      slug,
      description,
      additional_info,
      base_price,
      mrp,
      stock,
      images: allGalleryImages,
      foodType,
      hsnCode,
      sku,
    };

    // Update main_image only if a new one was uploaded
    if (main_image) {
      update.main_image = main_image;
    }

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
      const variantSku = String(get("sku") || "").trim() || undefined;

      const variantDoc: any = {
        product_id: id,
        type,
        label,
        sku: variantSku,
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
            const packSku = String(getP("sku") || "").trim() || undefined;
            return {
              label: String(getP("label") || "Pack"),
              price: Number(getP("price_per_unit") || 0),
              stock: Number(getP("stock") || 0),
              discount_percent: Number(getP("discount_percent") || 0),
              sku: packSku,
            };
          });
      } else {
        variantDoc.price = Number(get("price") || 0);
        variantDoc.stock = Number(get("stock") || 0);
        variantDoc.discount_percent = Number(get("discount_percent") || 0);
      }

      const variantImageFile = form.get(
        `variants[${vi}][image]`
      ) as File | null;
      const existingVariantImage = form.get(`variants[${vi}][existing_image]`);

      if (variantImageFile && variantImageFile.size > 0) {
        const variantImagePath = await saveUploadedFile(
          variantImageFile,
          `variant-${vi}-`
        );
        variantDoc.images = [variantImagePath];
      } else if (existingVariantImage) {
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
