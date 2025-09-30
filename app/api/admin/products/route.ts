import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";

export async function GET() {
  try {
    await dbConnect();

    // Just return products; no category/brand populate in new schema
    const products = await Product.find().lean();

    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    console.error("GET /api/admin/products error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const formData = await request.formData();

    // Required basics
    const name = String(formData.get("name") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required." },
        { status: 400 }
      );
    }

    console.log("[v0] POST /api/admin/products incoming:", {
      name,
      slug,
      hasMainImage: formData.get("mainImage") instanceof File,
      galleryCount: formData.getAll("galleryImages")?.length ?? 0,
    });

    const slugExists = await Product.exists({ slug });
    if (slugExists) {
      return NextResponse.json(
        { success: false, message: "Slug already exists." },
        { status: 409 }
      );
    }

    // Compute next numeric id to satisfy Product schema
    const lastDoc = await Product.findOne({}, { id: 1, _id: 0 })
      .sort({ id: -1 })
      .lean<{ id?: number }>();
    const nextId = (lastDoc?.id ?? 0) + 1;

    // New product fields
    const description = String(formData.get("description") || "");
    const base_price = Number(
      formData.get("price") || formData.get("base_price") || 0
    );
    const mrp = Number(formData.get("mrp") || 0);
    const stock = Number(formData.get("stock") || 0);

    // Images: store filenames (no upload backend configured yet)
    let main_image: string | undefined;
    const images: string[] = [];

    const mainImage = formData.get("mainImage");
    if (mainImage instanceof File && mainImage.name) {
      main_image = mainImage.name;
    }
    const galleryFiles = formData.getAll("galleryImages");
    for (const f of galleryFiles) {
      if (f instanceof File && f.name) images.push(f.name);
    }

    const categories = formData
      .getAll("categories")
      .map(String)
      .filter(Boolean);
    const brands = formData.getAll("brands").map(String).filter(Boolean);

    console.log("[v0] Categories and brands:", { categories, brands });

    let leafCategoryIds: string[] = [];
    if (categories.length > 0) {
      // Fetch all categories to determine which are leaf nodes
      const allCategories = await Category.find().lean();

      // Build a set of parent IDs (categories that have children)
      const parentIds = new Set<string>();
      allCategories.forEach((cat) => {
        if (cat.parentId) {
          parentIds.add(cat.parentId.toString());
        }
      });

      // Filter to only include categories that are NOT parents (i.e., leaf nodes)
      leafCategoryIds = categories.filter((catId) => !parentIds.has(catId));

      console.log("[v0] Filtered leaf categories:", leafCategoryIds);
    }

    let product;
    try {
      product = await Product.create({
        id: nextId,
        name,
        slug,
        description,
        base_price,
        mrp,
        stock,
        main_image,
        images,
        category: leafCategoryIds, // Store only leaf categories as array
        brand: brands.length > 0 ? brands[0] : undefined, // Store first brand only (schema expects single ref)
      });
    } catch (e: any) {
      if (
        e &&
        typeof e === "object" &&
        (e.code === 11000 || e?.name === "MongoServerError")
      ) {
        return NextResponse.json(
          { success: false, message: "Slug already exists." },
          { status: 409 }
        );
      }
      throw e;
    }

    // Parse variants from bracketed form keys like variants[0][type], variants[0][packs][0][label], etc.
    type ParsedPack = {
      label?: string;
      price?: number;
      stock?: number;
      discount_percent?: number;
      images?: string[];
    };
    type ParsedVariant = {
      type?: "weight" | "size" | "custom";
      label?: string;
      price?: number;
      stock?: number;
      discount_percent?: number;
      images?: string[];
      packs?: Record<number, ParsedPack>;
    };

    const variantMap = new Map<number, ParsedVariant>();

    formData.forEach((value, rawKey) => {
      if (!rawKey.startsWith("variants[")) return;

      // Examples:
      // variants[0][type]
      // variants[0][label]
      // variants[0][price]
      // variants[0][stock]
      // variants[0][discount_percent]
      // variants[0][image]  (File)
      // variants[0][packs][1][label]
      // variants[0][packs][1][price_per_unit]
      // variants[0][packs][1][stock]
      // variants[0][packs][1][discount_percent]

      const match =
        /^variants\[(\d+)\](?:\[(packs)\]\[(\d+)\]\[(\w+)\]|\[(\w+)\])$/.exec(
          rawKey
        );
      if (!match) return;

      const vIdx = Number(match[1]);
      const isPack = !!match[2];
      const packIdx = match[3] ? Number(match[3]) : undefined;
      const field = (match[4] || match[5]) as string;

      if (!variantMap.has(vIdx)) {
        variantMap.set(vIdx, { packs: {} });
      }
      const variant = variantMap.get(vIdx)!;

      if (isPack && packIdx !== undefined) {
        variant.packs ||= {};
        variant.packs[packIdx] ||= {};

        // Map incoming fields to schema
        if (field === "label") {
          variant.packs[packIdx].label = String(value);
        } else if (field === "price_per_unit") {
          variant.packs[packIdx].price = Number(value || 0);
        } else if (field === "stock") {
          variant.packs[packIdx].stock = Number(value || 0);
        } else if (field === "discount_percent") {
          variant.packs[packIdx].discount_percent = Number(value || 0);
        } else if (field === "image" && value instanceof File && value.name) {
          const fileName = value.name;
          const arr = variant.packs[packIdx].images || [];
          arr.push(fileName);
          variant.packs[packIdx].images = arr;
        }
      } else {
        if (field === "type") {
          const t = String(value);
          if (t === "weight" || t === "size" || t === "custom") {
            variant.type = t;
          }
        } else if (field === "label") {
          variant.label = String(value);
        } else if (field === "price") {
          variant.price = Number(value || 0);
        } else if (field === "stock") {
          variant.stock = Number(value || 0);
        } else if (field === "discount_percent") {
          variant.discount_percent = Number(value || 0);
        } else if (field === "image" && value instanceof File && value.name) {
          const fileName = value.name;
          const arr = variant.images || [];
          arr.push(fileName);
          variant.images = arr;
        }
        // Note: UI may send `weight_value` for weight type; schema doesn't define it explicitly.
        // We rely on `label` to capture user-visible weight (e.g. "1 kg").
      }
    });

    // Build and insert variant docs
    if (variantMap.size > 0) {
      const { default: ProductVariant } = await import(
        "@/lib/models/ProductVariant"
      );

      const variantDocs = Array.from(variantMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([, v]) => {
          const base: any = {
            product_id: product._id,
            type: v.type,
            label: v.label,
            images: v.images || [],
          };

          if (v.type === "weight") {
            // Packs for weight variants
            const packs: any[] = [];
            if (v.packs) {
              Object.keys(v.packs)
                .map((k) => Number(k))
                .sort((a, b) => a - b)
                .forEach((k) => {
                  const p = v.packs![k];
                  packs.push({
                    label: p.label,
                    price: p.price ?? 0,
                    stock: p.stock ?? 0,
                    discount_percent: p.discount_percent ?? 0,
                    images: p.images || [],
                  });
                });
            }
            base.packs = packs;
          } else {
            // Size/custom variants use price/stock/discount
            base.price = v.price ?? 0;
            base.stock = v.stock ?? 0;
            base.discount_percent = v.discount_percent ?? 0;
          }

          return base;
        });

      if (variantDocs.length > 0) {
        await ProductVariant.insertMany(variantDocs);
      }
    }

    return NextResponse.json(
      { success: true, message: "Product added successfully!", data: product },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/admin/products error:", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
