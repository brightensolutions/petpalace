import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import Footer from "@/components/footer";
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

// ✅ Next.js 15 - params is now a Promise
type PageProps = {
  params: Promise<{
    slug: string[]; // from [...slug]
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// ✅ Make component async and await params
export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const categories = [
    { name: "All Cat Food", icon: "🐱", count: 245 },
    { name: "Dry Food", icon: "🥘", count: 156 },
    { name: "Wet Food", icon: "🥫", count: 89 },
    { name: "Grain Free Food", icon: "🌾", count: 67 },
    { name: "Kitten Food", icon: "🐾", count: 45 },
    { name: "Veterinary Food", icon: "💊", count: 23 },
    { name: "Supplements", icon: "💊", count: 34 },
  ];

  const filterSections = [
    {
      title: "Brand",
      options: [
        "Royal Canin",
        "Whiskas",
        "Purina",
        "Farmina",
        "Hills",
        "Drools",
      ],
    },
    {
      title: "Life Stage",
      options: ["Puppy", "Adult", "Senior", "All Life Stages"],
    },
    {
      title: "Breed Size",
      options: ["Small Breed", "Medium Breed", "Large Breed", "Giant Breed"],
    },
    {
      title: "Special Diet",
      options: [
        "Grain Free",
        "Limited Ingredient",
        "Weight Management",
        "Sensitive Stomach",
      ],
    },
    {
      title: "Protein Source",
      options: ["Chicken", "Fish", "Lamb", "Beef", "Turkey", "Duck"],
    },
  ];

  const products = [
    {
      id: 1,
      slug: "royal-canin-ultra-light-wet-cat-food",
      name: "Royal Canin Ultra Light Wet Cat Food",
      brand: "Royal Canin",
      image: "/placeholder.svg?height=200&width=200&text=Royal+Canin",
      rating: 5.0,
      reviews: 124,
      originalPrice: 120.52,
      discountedPrice: 100.52,
      discount: 17,
      sizes: ["85g", "Pack Of 4", "Pack Of 8"],
    },
    {
      id: 2,
      slug: "royal-canin-fit-32-adult-dry-cat-food",
      name: "Royal Canin Fit 32 Adult Dry Cat Food",
      brand: "Royal Canin",
      image: "/placeholder.svg?height=200&width=200&text=Royal+Canin+Dry",
      rating: 4.9,
      reviews: 89,
      originalPrice: 452,
      discountedPrice: 352,
      discount: 22,
      sizes: ["400g", "1kg", "2kg", "4kg"],
    },
    {
      id: 3,
      slug: "farmina-nd-chicken-pomegranate-grain-free",
      name: "Farmina N&D Chicken & Pomegranate Grain Free",
      brand: "Farmina",
      image: "/placeholder.svg?height=200&width=200&text=Farmina",
      rating: 4.89,
      reviews: 156,
      originalPrice: 907.55,
      discountedPrice: 707.55,
      discount: 22,
      sizes: ["300g", "1.5kg", "5kg"],
    },
    {
      id: 4,
      slug: "meowsi-tuna-chicken-pate-canned-cat-food",
      name: "Meowsi Tuna & Chicken Pate Canned Cat Food",
      brand: "Meowsi",
      image: "/placeholder.svg?height=200&width=200&text=Meowsi",
      rating: 4.7,
      reviews: 67,
      originalPrice: 180,
      discountedPrice: 160,
      discount: 11,
      sizes: ["80g", "Pack Of 6", "Pack Of 12"],
    },
    {
      id: 5,
      slug: "whiskas-adult-dry-cat-food-ocean-fish",
      name: "Whiskas Adult Dry Cat Food Ocean Fish",
      brand: "Whiskas",
      image: "/placeholder.svg?height=200&width=200&text=Whiskas",
      rating: 4.5,
      reviews: 234,
      originalPrice: 299,
      discountedPrice: 249,
      discount: 17,
      sizes: ["480g", "1.2kg", "3kg"],
    },
    {
      id: 6,
      slug: "purina-pro-plan-adult-cat-food-chicken",
      name: "Purina Pro Plan Adult Cat Food Chicken",
      brand: "Purina Pro Plan",
      image: "/placeholder.svg?height=200&width=200&text=Purina",
      rating: 4.8,
      reviews: 178,
      originalPrice: 650,
      discountedPrice: 550,
      discount: 15,
      sizes: ["400g", "1kg", "2.5kg"],
    },
    {
      id: 7,
      slug: "hills-science-diet-adult-cat-food",
      name: "Hills Science Diet Adult Cat Food",
      brand: "Hills",
      image: "/placeholder.svg?height=200&width=200&text=Hills",
      rating: 4.6,
      reviews: 92,
      originalPrice: 850,
      discountedPrice: 720,
      discount: 15,
      sizes: ["400g", "1kg", "3kg"],
    },
    {
      id: 8,
      slug: "drools-optimum-performance-adult-cat-food",
      name: "Drools Optimum Performance Adult Cat Food",
      brand: "Drools",
      image: "/placeholder.svg?height=200&width=200&text=Drools",
      rating: 4.4,
      reviews: 156,
      originalPrice: 450,
      discountedPrice: 380,
      discount: 16,
      sizes: ["400g", "1.2kg", "3kg"],
    },
  ];

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
              {slug[slug.length - 1].replace(/-/g, " ")}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Professional Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-4">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Search Filter */}
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10 text-sm"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xl">{category.icon}</span>
                        <div className="flex-1">
                          <span className="text-sm text-gray-700">
                            {category.name}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({category.count})
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dynamic Filter Sections */}
                {filterSections.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <button className="flex items-center justify-between w-full py-2 text-left">
                      <h4 className="font-medium text-gray-900">
                        {section.title}
                      </h4>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    <div className="mt-2 space-y-2">
                      {section.options
                        .slice(0, 4)
                        .map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className="flex items-center gap-2 p-1 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">
                              {option}
                            </span>
                          </label>
                        ))}
                      {section.options.length > 4 && (
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          +{section.options.length - 4} more
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Price Range
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Min" className="text-sm" />
                    <Input placeholder="Max" className="text-sm" />
                  </div>
                  <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-sm">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 capitalize mb-1">
                    {slug[slug.length - 1].replace(/-/g, " ")}
                  </h1>
                  <p className="text-gray-600">
                    Showing {products.length} of 245 products
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
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 bg-transparent"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 bg-transparent"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid - 4 in a row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-all duration-300 bg-white border"
                >
                  <CardContent className="p-0">
                    {/* Compact Product Image */}
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="relative overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={160}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Discount Badge */}
                        {product.discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1">
                            {product.discount}% OFF
                          </Badge>
                        )}
                        {/* Wishlist Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </Link>

                    {/* Compact Product Info */}
                    <div className="p-3">
                      {/* Brand */}
                      <p className="text-xs text-blue-600 font-medium mb-1">
                        {product.brand}
                      </p>

                      {/* Product Name - Shorter */}
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 leading-tight hover:text-blue-600 transition-colors cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium">
                            {product.rating}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.reviews})
                        </span>
                      </div>

                      {/* Size Options - Compact */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.sizes.slice(0, 2).map((size, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs px-2 py-1 h-6 rounded border-gray-300 hover:border-blue-500 hover:text-blue-600 bg-transparent"
                          >
                            {size}
                          </Button>
                        ))}
                        {product.sizes.length > 2 && (
                          <span className="text-xs text-blue-600">
                            +{product.sizes.length - 2}
                          </span>
                        )}
                      </div>

                      {/* Price and Add to Cart in same row */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{product.discountedPrice}
                          </span>
                          {product.originalPrice > product.discountedPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-xs rounded-lg flex items-center gap-1"
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

            {/* Load More */}
            <div className="text-center mt-8">
              <Button
                variant="outline"
                className="px-6 py-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 bg-transparent"
              >
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

// ✅ Next.js 15 - async generateMetadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = slug[slug.length - 1];

  return {
    title: `${category.replace("-", " ")} - PetPalace`,
    description: `Shop the best ${category.replace(
      "-",
      " "
    )} products at PetPalace`,
  };
}
