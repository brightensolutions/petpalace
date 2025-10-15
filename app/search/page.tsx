import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import Brand from "@/lib/models/Brand";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SearchClient from "./search-client";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: searchQuery } = await searchParams;
  const query = searchQuery?.trim() || "";

  await dbConnect();

  // Search products by name (case-insensitive)
  const products = query
    ? await Product.find({
        name: { $regex: query, $options: "i" },
      })
        .populate("brand", "name slug")
        .populate("category", "name slug")
        .select(
          "name slug main_image base_price mrp discount rating reviews stock brand category createdAt"
        )
        .lean()
    : [];

  const productIds = products.map((p: any) => p._id);
  const ProductVariant = (await import("@/lib/models/ProductVariant")).default;
  const variants = query
    ? await ProductVariant.find({
        product_id: { $in: productIds },
      })
        .select(
          "product_id type label price discount_percent stock images packs sku"
        )
        .lean()
    : [];

  // Attach variants to products
  const productsWithVariants = products.map((product: any) => ({
    ...product,
    variants: variants.filter(
      (v: any) => String(v.product_id) === String(product._id)
    ),
  }));

  // Get all brands for filtering
  const productBrandIds = productsWithVariants
    .map((p: any) => p.brand?._id)
    .filter(Boolean);
  const uniqueBrandIds = [...new Set(productBrandIds.map(String))];
  const brands = await Brand.find({
    _id: { $in: uniqueBrandIds },
  })
    .select("name slug")
    .lean();

  // Get all parent categories for filtering
  const allParentCategories = await Category.find({ parentId: null })
    .select("name slug _id")
    .lean();

  // Get all categories that products belong to
  const productCategoryIds = productsWithVariants
    .map((p: any) => p.category?._id)
    .filter(Boolean);
  const uniqueCategoryIds = [...new Set(productCategoryIds.map(String))];
  const productCategories = await Category.find({
    _id: { $in: uniqueCategoryIds },
  })
    .select("name slug _id parentId")
    .lean();

  // Convert MongoDB objects to plain objects for client component
  const serializedProducts = JSON.parse(JSON.stringify(productsWithVariants));
  const serializedBrands = JSON.parse(JSON.stringify(brands));
  const serializedAllParentCategories = JSON.parse(
    JSON.stringify(allParentCategories)
  );
  const serializedProductCategories = JSON.parse(
    JSON.stringify(productCategories)
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white py-3 border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Search Results</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {query ? `Search Results for "${query}"` : "Search Products"}
          </h1>
          <p className="text-gray-600">
            {query
              ? `Found ${serializedProducts.length} product${
                  serializedProducts.length !== 1 ? "s" : ""
                }`
              : "Enter a search query to find products"}
          </p>
        </div>

        <SearchClient
          products={serializedProducts}
          brands={serializedBrands}
          allParentCategories={serializedAllParentCategories}
          productCategories={serializedProductCategories}
          searchQuery={query}
        />
      </div>

      <Footer />
    </div>
  );
}
