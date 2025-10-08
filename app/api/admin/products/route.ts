import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

async function saveUploadedFile(file: File, prefix = ""): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${prefix}${timestamp}-${randomStr}.${ext}`;

  const productsDir = join(process.cwd(), "public", "products");
  await mkdir(productsDir, { recursive: true });

  const filepath = join(productsDir, filename);
  await writeFile(filepath, buffer);

  return `/products/${filename}`;
}

export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find().populate("category", "name").lean();

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

    const lastDoc = await Product.findOne({}, { id: 1, _id: 0 })
      .sort({ id: -1 })
      .lean<{ id?: number }>();
    const nextId = (lastDoc?.id ?? 0) + 1;

    const description = String(formData.get("description") || "");
    const base_price = Number(
      formData.get("price") || formData.get("base_price") || 0
    );
    const mrp = Number(formData.get("mrp") || 0);
    const stock = Number(formData.get("stock") || 0);
    const foodTypeRaw = formData.get("foodType");
    const foodType =
      foodTypeRaw === "veg" || foodTypeRaw === "non-veg"
        ? foodTypeRaw
        : undefined;
    const hsnCode = String(formData.get("hsnCode") || "").trim() || undefined;
    const sku = String(formData.get("sku") || "").trim() || undefined;

    let main_image: string | undefined;
    const images: string[] = [];

    const mainImageFile = formData.get("mainImage");
    if (mainImageFile instanceof File && mainImageFile.size > 0) {
      main_image = await saveUploadedFile(mainImageFile, "main-");
    }

    const galleryFiles = formData.getAll("galleryImages");
    for (const f of galleryFiles) {
      if (f instanceof File && f.size > 0) {
        const path = await saveUploadedFile(f, "gallery-");
        images.push(path);
      }
    }

    const categories = formData
      .getAll("categories")
      .map(String)
      .filter(Boolean);
    const brands = formData.getAll("brands").map(String).filter(Boolean);

    console.log("[v0] Categories and brands:", { categories, brands });

    let leafCategoryId: string | undefined;
    if (categories.length > 0) {
      const allCategories = await Category.find().lean();

      const parentIds = new Set<string>();
      allCategories.forEach((cat) => {
        if (cat.parentId) {
          parentIds.add(cat.parentId.toString());
        }
      });

      const leafCategoryIds = categories.filter(
        (catId) => !parentIds.has(catId)
      );

      leafCategoryId = leafCategoryIds[0];

      console.log("[v0] Selected leaf category:", leafCategoryId);
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
        category: leafCategoryId,
        brand: brands.length > 0 ? brands[0] : undefined,
        foodType,
        hsnCode,
        sku,
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

    type ParsedPack = {
      label?: string;
      price?: number;
      stock?: number;
      discount_percent?: number;
      images?: string[];
      sku?: string;
    };
    type ParsedVariant = {
      type?: "weight" | "size" | "custom";
      label?: string;
      price?: number;
      stock?: number;
      discount_percent?: number;
      images?: string[];
      packs?: Record<number, ParsedPack>;
      sku?: string;
    };

    const variantMap = new Map<number, ParsedVariant>();

    formData.forEach((value, rawKey) => {
      if (!rawKey.startsWith("variants[")) return;

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

        if (field === "label") {
          variant.packs[packIdx].label = String(value);
        } else if (field === "price_per_unit") {
          variant.packs[packIdx].price = Number(value || 0);
        } else if (field === "stock") {
          variant.packs[packIdx].stock = Number(value || 0);
        } else if (field === "discount_percent") {
          variant.packs[packIdx].discount_percent = Number(value || 0);
        } else if (field === "sku") {
          variant.packs[packIdx].sku = String(value || "").trim() || undefined;
        } else if (
          field === "image" &&
          value instanceof File &&
          value.size > 0
        ) {
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
        } else if (field === "sku") {
          variant.sku = String(value || "").trim() || undefined;
        } else if (
          field === "image" &&
          value instanceof File &&
          value.size > 0
        ) {
          const fileName = value.name;
          const arr = variant.images || [];
          arr.push(fileName);
          variant.images = arr;
        }
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
            sku: v.sku,
          };

          if (v.type === "weight") {
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
                    sku: p.sku,
                  });
                });
            }
            base.packs = packs;
          } else {
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
