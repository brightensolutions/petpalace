// app/categories/page.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FilterSection, { FilterOption } from "@/components/FilterSection";
import {
  Star,
  Grid3X3,
  List,
  ChevronDown,
  Heart,
  ShoppingCart,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

type Filter = {
  _id: string;
  name: string;
};

type FilterOption = {
  _id: string;
  filter_id: string;
  value: string;
  result_count: number;
};

type Product = {
  id: number;
  slug: string;
  name: string;
  brand_id: { _id: string; name: string };
  price: number;
  original_price: number;
  rating: number;
  review_count: number;
};

export default async function CategoryPage({ params }: PageProps) {
  // 1. get current slug
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];

  // 2. fetch filters + options + products
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
  const [fRes, oRes, pRes] = await Promise.all([
    fetch(`${API}/filters`, { cache: "no-store" }),
    fetch(`${API}/options`, { cache: "no-store" }),
    fetch(`${API}/products?category=${currentSlug}`, { cache: "no-store" }),
  ]);

  const filters: Filter[] = await fRes.json();
  const options: FilterOption[] = await oRes.json();
  const productsData: Product[] = await pRes.json();

  // 3. build filterSections: each filter with its options
  const filterSections = filters.map((f) => {
    const opts = options
      .filter((o) => o.filter_id === f._id)
      .map((o) => ({
        label: o.value,
        count: o.result_count,
      }));
    return { title: f.name, options: opts };
  });

  // 4. prepare products for UI
  const products = productsData.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand_id?.name || "Unknown Brand",
    image: "/placeholder.svg",
    rating: p.rating,
    reviews: p.review_count,
    price: p.price,
    originalPrice: p.original_price,
    discount:
      p.original_price > p.price
        ? Math.round((1 - p.price / p.original_price) * 100)
        : 0,
  }));

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
              {currentSlug.replace(/-/g, " ")}
            </span>
          </nav>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-4">
              <div className="p-4 border-b flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Filters
                </h3>
              </div>
              <div className="p-4 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 text-sm"
                  />
                </div>

                {/* Dynamic filterSections */}
                {filterSections.map((section, i) => (
                  <FilterSection
                    key={i}
                    title={section.title}
                    options={section.options}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-4">
            {/* Products Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize mb-1">
                  {currentSlug.replace(/-/g, " ")}
                </h1>
                <p className="text-gray-600">
                  Showing {products.length} of {products.length} products
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Customer Rating</option>
                  <option>Newest First</option>
                </select>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <Card
                  key={p.id}
                  className="group hover:shadow-lg transition-all bg-white border"
                >
                  <CardContent className="p-0">
                    <Link href={`/products/${p.slug}`} className="block">
                      <div className="relative overflow-hidden">
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={200}
                          height={160}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                        />
                        {p.discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1">
                            {p.discount}% OFF
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </Link>
                    <div className="p-3">
                      <p className="text-xs text-blue-600 font-medium mb-1">
                        {p.brand}
                      </p>
                      <Link href={`/products/${p.slug}`}>
                        <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
                          {p.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">
                          {p.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({p.reviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{p.price}
                          </span>
                          {p.originalPrice > p.price && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{p.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg flex items-center gap-1"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" className="px-6 py-2">
                Load More Products
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Category – PetPalace",
    description: "Browse products by category on PetPalace",
  };
}
