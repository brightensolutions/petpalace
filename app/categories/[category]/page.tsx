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

// ✅ Next.js 15 - params is now a Promise
type PageProps = {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// ✅ Make component async and await params
export default async function CategoryPage({ params }: PageProps) {
  // ✅ Await the params promise
  const { category } = await params;

  const filterTabs = [
    "Brand",
    "Shop For",
    "Life Stage",
    "Breed Size",
    "Product Type",
    "Special Diet",
    "Protein Source",
    "Price Range",
  ];

  const categories = [
    { name: "All Cat Food", icon: "🐱", count: 245 },
    { name: "Dry Food", icon: "🥘", count: 156 },
    { name: "Wet Food", icon: "🥫", count: 89 },
    { name: "Grain Free Food", icon: "🌾", count: 67 },
    { name: "Kitten Food", icon: "🐾", count: 45 },
    { name: "Veterinary Food", icon: "💊", count: 23 },
    { name: "Supplements", icon: "💊", count: 34 },
  ];

  const products = [
    {
      id: 1,
      name: "Royal Canin Ultra Light Wet Cat Food - 85g packs",
      brand: "Royal Canin",
      image: "/placeholder.svg?height=300&width=300&text=Royal+Canin+Cat+Food",
      rating: 5.0,
      reviews: 124,
      originalPrice: 120.52,
      discountedPrice: 100.52,
      discount: "Extra 3% OFF",
      sizes: ["Pack Of 1", "Pack Of 4", "Pack Of 8"],
      badges: ["12%", "15%", "18%"],
    },
    {
      id: 2,
      name: "Royal Canin Fit 32 Adult Dry Cat Food",
      brand: "Royal Canin",
      image: "/placeholder.svg?height=300&width=300&text=Royal+Canin+Dry+Food",
      rating: 4.9,
      reviews: 89,
      originalPrice: 452,
      discountedPrice: 352,
      discount: "Extra 3% OFF",
      sizes: ["400g", "1kg", "2kg", "4kg"],
      badges: ["10%", "12%", "15%", "18%"],
    },
    {
      id: 3,
      name: "Farmina N&D Chicken & Pomegranate Grain Free Adult Cat Food",
      brand: "Farmina",
      image: "/placeholder.svg?height=300&width=300&text=Farmina+Cat+Food",
      rating: 4.89,
      reviews: 156,
      originalPrice: 907.55,
      discountedPrice: 707.55,
      discount: "Extra 5% Off upto ₹400",
      sizes: ["300g", "1.5kg", "5kg"],
      badges: ["11%", "13%", "16%"],
    },
    {
      id: 4,
      name: "Meowsi by HUFT Tuna & Chicken Pate Canned Cat Wet Food - 80g",
      brand: "Meowsi",
      image: "/placeholder.svg?height=300&width=300&text=Meowsi+Wet+Food",
      rating: 4.7,
      reviews: 67,
      originalPrice: 180,
      discountedPrice: 160,
      discount: "Extra 3% OFF",
      sizes: ["Pack Of 1", "Pack Of 6", "Pack Of 12"],
      badges: ["5%", "8%", "12%"],
    },
    {
      id: 5,
      name: "Whiskas Adult Dry Cat Food - Ocean Fish Flavour",
      brand: "Whiskas",
      image: "/placeholder.svg?height=300&width=300&text=Whiskas+Cat+Food",
      rating: 4.5,
      reviews: 234,
      originalPrice: 299,
      discountedPrice: 249,
      discount: "Extra 3% OFF",
      sizes: ["480g", "1.2kg", "3kg"],
      badges: ["8%", "12%", "15%"],
    },
    {
      id: 6,
      name: "Purina Pro Plan Adult Cat Food - Chicken & Rice",
      brand: "Purina Pro Plan",
      image: "/placeholder.svg?height=300&width=300&text=Purina+Cat+Food",
      rating: 4.8,
      reviews: 178,
      originalPrice: 650,
      discountedPrice: 550,
      discount: "Extra 5% Off upto ₹400",
      sizes: ["400g", "1kg", "2.5kg"],
      badges: ["10%", "15%", "18%"],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50/50 py-2">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium capitalize">
              {category.replace("-", " ")}
            </span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
              {category.replace("-", " ")}
            </h1>
            <p className="text-gray-600">
              Premium quality products for your beloved pets
            </p>
          </div>

          {/* View Toggle & Sort */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="p-2">
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <List className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Button variant="outline" size="sm" className="gap-2">
                Popularity
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-4">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 h-10 rounded-lg border-gray-200"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((cat, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {cat.name}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {cat.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="space-y-4">
                {filterTabs.map((tab, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4">
                    <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <span className="text-sm font-medium text-gray-700">
                        {tab}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {products.length} of 245 products
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-all duration-200 border-gray-200 rounded-2xl overflow-hidden"
                >
                  <div className="relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />

                    {/* Wishlist Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-sm"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>

                    {/* Discount Badge */}
                    {product.discount && (
                      <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white text-xs">
                        {product.discount}
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        {product.brand}
                      </p>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.reviews} reviews)
                      </span>
                    </div>

                    {/* Size Options */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.slice(0, 3).map((size, index) => (
                          <div key={index} className="relative">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 px-2 rounded-md border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                            >
                              {size}
                            </Button>
                            {product.badges[index] && (
                              <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0 h-4 min-w-0">
                                {product.badges[index]}
                              </Badge>
                            )}
                          </div>
                        ))}
                        {product.sizes.length > 3 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 px-2 text-blue-600 hover:text-blue-700"
                          >
                            +{product.sizes.length - 3} more
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.discountedPrice}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg h-9">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button
                variant="outline"
                className="px-8 py-2 rounded-lg border-gray-200 hover:border-orange-300 hover:bg-orange-50"
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
export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;

  return {
    title: `${category.replace("-", " ")} - PetPalace`,
    description: `Shop the best ${category.replace(
      "-",
      " "
    )} products at PetPalace`,
  };
}
