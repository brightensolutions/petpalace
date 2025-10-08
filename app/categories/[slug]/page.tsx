import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import Brand from "@/lib/models/Brand";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryClient from "./category-client";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();

  await dbConnect();

  // Resolve category if slug provided
  let categoryDoc: any = null;
  if (slug) {
    categoryDoc = await Category.findOne({ slug }).lean();
  }

  // Build list of category ids: selected + all descendants
  const categoryIds: any[] = [];
  if (categoryDoc?._id) {
    categoryIds.push(categoryDoc._id);

    const queue: any[] = [categoryDoc._id];
    while (queue.length) {
      const parentId = queue.shift();
      const children = await Category.find({ parentId }).select("_id").lean();
      for (const child of children) {
        categoryIds.push(child._id);
        queue.push(child._id);
      }
    }
  }

  // Fetch products in these categories
  let query: any = {};
  if (categoryIds.length) {
    query = { category: { $in: categoryIds } };
  }

  const products = await Product.find(query)
    .populate("brand", "name slug")
    .populate("category", "name slug")
    .select(
      "name slug main_image base_price mrp discount rating reviews stock brand category foodType createdAt"
    )
    .lean();

  const productIds = products.map((p: any) => p._id);
  const ProductVariant = (await import("@/lib/models/ProductVariant")).default;
  const variants = await ProductVariant.find({
    product_id: { $in: productIds },
  })
    .select(
      "product_id type label price discount_percent stock images packs sku"
    )
    .lean();

  // Attach variants to products
  const productsWithVariants = products.map((product: any) => ({
    ...product,
    variants: variants.filter(
      (v: any) => String(v.product_id) === String(product._id)
    ),
  }));

  let subcategories: any[] = [];
  if (categoryDoc?.parentId) {
    // If current category has a parent, show all siblings (same level categories)
    subcategories = await Category.find({ parentId: categoryDoc.parentId })
      .select("name slug _id parentId")
      .lean();
  } else if (categoryDoc?._id) {
    // If it's a parent category, show its direct children
    subcategories = await Category.find({ parentId: categoryDoc._id })
      .select("name slug _id parentId")
      .lean();
  } else {
    // If no category selected, show top-level categories
    subcategories = await Category.find({ parentId: null })
      .select("name slug _id parentId")
      .lean();
  }

  const productBrandIds = products
    .map((p: any) => p.brand?._id)
    .filter(Boolean);
  const uniqueBrandIds = [...new Set(productBrandIds.map(String))];
  const brands = await Brand.find({
    _id: { $in: uniqueBrandIds },
  })
    .select("name slug")
    .lean();

  const categoryTitle =
    categoryDoc?.name || (slug ? slug.replace(/-/g, " ") : "All Products");

  // Convert MongoDB objects to plain objects for client component
  const serializedProducts = JSON.parse(JSON.stringify(productsWithVariants));
  const serializedSubcategories = JSON.parse(JSON.stringify(subcategories));
  const serializedBrands = JSON.parse(JSON.stringify(brands));
  const serializedCurrentCategory = categoryDoc
    ? JSON.parse(JSON.stringify(categoryDoc))
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white py-3 border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium capitalize">
              {categoryTitle}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">
            {categoryTitle}
          </h1>
          <p className="text-gray-600">
            Discover our collection of {serializedProducts.length} products
          </p>
        </div>

        <CategoryClient
          subcategories={serializedSubcategories}
          products={serializedProducts}
          brands={serializedBrands}
          categoryTitle={categoryTitle}
          currentCategory={serializedCurrentCategory}
        />
      </div>

      <Footer />
    </div>
  );
}
