import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db"; // Assuming this is your dbConnect path
import Product from "@/lib/models/Product"; // Assuming this is your Product model path

// Import Category and Brand models for the GET handler's populate
// These imports are typically done at the top, but if your dbConnect
// or model registration logic requires dynamic import, keep it as is.
// For consistency and clarity, I'll put them here for the GET handler.

export async function GET() {
  try {
    await dbConnect();
    // ✅ Ensure models are registered BEFORE querying with populate
    // If your models are already registered via a global or initial import,
    // these dynamic imports might not be strictly necessary, but keeping them
    // as per your provided code.
    const Category = (await import("@/lib/models/Category")).default;
    const Brand = (await import("@/lib/models/Brand")).default;
    console.log("Models registered:", {
      Product: !!Product,
      Category: !!Category,
      Brand: !!Brand,
    });
    const products = await Product.find()
      .populate("category_id", "name")
      .populate("brand_id", "name")
      .lean();
    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    console.error("GET /products error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect(); // Ensure database connection is established

  try {
    const formData = await request.formData();

    // In a real application, you would parse formData, validate,
    // and save to your database using your Mongoose models.
    // For now, we'll just log and simulate success.

    console.log("--- Received Product Submission ---");
    console.log("Name:", formData.get("name"));
    console.log("Slug:", formData.get("slug"));
    console.log("Description (HTML):", formData.get("description"));
    console.log("Base Price:", formData.get("price"));
    console.log("MRP Price:", formData.get("mrp"));
    console.log("Product Stock:", formData.get("stock"));
    console.log(
      "Additional Product Info (HTML):",
      formData.get("additional_info")
    );
    console.log("Categories:", formData.getAll("categories"));
    console.log("Brands:", formData.getAll("brands"));
    console.log(
      "Main Image:",
      formData.get("mainImage")
        ? (formData.get("mainImage") as File).name
        : "No main image"
    );
    console.log(
      "Gallery Images Count:",
      formData.getAll("galleryImages").length
    );

    const variants: any[] = [];
    for (let i = 0; ; i++) {
      const type = formData.get(`variants[${i}][type]`);
      if (!type) break;

      const variant: any = {
        type: type,
        label: formData.get(`variants[${i}][label]`),
        image: formData.get(`variants[${i}][image]`)
          ? (formData.get(`variants[${i}][image]`) as File).name
          : "No variant image",
      };

      if (type === "weight") {
        variant.weight_value = formData.get(`variants[${i}][weight_value]`);
        const packs: any[] = [];
        for (let j = 0; ; j++) {
          const packLabel = formData.get(`variants[${i}][packs][${j}][label]`);
          if (!packLabel) break;
          packs.push({
            label: packLabel,
            price_per_unit: formData.get(
              `variants[${i}][packs][${j}][price_per_unit]`
            ),
            stock: formData.get(`variants[${i}][packs][${j}][stock]`),
            discount_percent: formData.get(
              `variants[${i}][packs][${j}][discount_percent]`
            ),
          });
        }
        variant.packs = packs;
      } else {
        variant.price = formData.get(`variants[${i}][price]`);
        variant.stock = formData.get(`variants[${i}][stock]`);
        variant.discount_percent = formData.get(
          `variants[${i}][discount_percent]`
        );
      }
      variants.push(variant);
    }
    console.log("Variants:", variants);
    console.log("---------------------------------");

    // Simulate a successful response
    return NextResponse.json(
      { success: true, message: "Product added successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing product submission:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
