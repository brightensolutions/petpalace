import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, Search, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

function formatINR(n: number) {
  try {
    return new Intl.NumberFormat("en-IN").format(n);
  } catch {
    return String(n);
  }
}

function computeDiscount(mrp?: number | null, base?: number | null) {
  if (!mrp || !base || mrp <= 0 || base >= mrp) return 0;
  return Math.round(((mrp - base) / mrp) * 100);
}

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
    .select("name slug main_image base_price mrp discount rating reviews")
    .lean();

  const categoryTitle =
    categoryDoc?.name || (slug ? slug.replace(/-/g, " ") : "All Products");
  const total = products.length;

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
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-4">
              <div className="p-4 border-b flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900 capitalize mb-1">
                  {categoryTitle}
                </h3>
              </div>
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 capitalize mb-1">
                    {categoryTitle}
                  </h1>
                  <p className="text-gray-600">Showing {total} products</p>
                </div>
              </div>
            </div>

            {total === 0 ? (
              <div className="bg-white rounded-lg border p-10 text-center text-gray-600">
                No products found {slug ? "for this category" : ""}.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p: any) => {
                  const discountedPrice = p.base_price ?? p.mrp ?? 0;
                  const originalPrice = p.mrp ?? p.base_price ?? 0;
                  const computed = computeDiscount(p.mrp, p.base_price);
                  const discount =
                    Number.isFinite(computed) && computed > 0
                      ? computed
                      : p.discount ?? 0;
                  const rating =
                    typeof p.rating === "number" ? p.rating.toFixed(1) : "4.6";
                  const reviews = typeof p.reviews === "number" ? p.reviews : 0;

                  return (
                    <Card
                      key={p._id?.toString?.() ?? p.slug}
                      className="group hover:shadow-lg transition-all duration-300 bg-white border"
                    >
                      <CardContent className="p-0">
                        <Link
                          href={`/products/${p.slug}`}
                          className="block"
                          prefetch={false}
                        >
                          <div className="relative overflow-hidden">
                            <Image
                              src={
                                p.main_image ||
                                "/placeholder.svg?height=160&width=200&query=product-image"
                              }
                              alt={p.name || "Product image"}
                              width={200}
                              height={160}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {discount > 0 && (
                              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                {discount}% OFF
                              </span>
                            )}
                            <button
                              aria-label="Add to favorites"
                              className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center"
                            >
                              <Heart className="w-4 h-4" />
                            </button>
                          </div>
                        </Link>

                        <div className="p-3">
                          <Link href={`/products/${p.slug}`} prefetch={false}>
                            <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 leading-tight hover:text-blue-600 transition-colors cursor-pointer">
                              {p.name}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-1 mb-2">
                            <svg
                              className="w-3 h-3 text-yellow-400 fill-current"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 .587l3.668 7.429 8.2 1.193-5.934 5.786 1.401 8.168L12 18.896l-7.335 3.867 1.401-8.168L.132 9.209l8.2-1.193z" />
                            </svg>
                            <span className="text-xs font-medium">
                              {rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({reviews})
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col">
                              <span className="text-lg font-bold text-gray-900">
                                ₹{formatINR(discountedPrice)}
                              </span>
                              {originalPrice > discountedPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  ₹{formatINR(originalPrice)}
                                </span>
                              )}
                            </div>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-xs rounded-lg flex items-center gap-1">
                              <ShoppingCart className="w-3 h-3" /> Add
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
