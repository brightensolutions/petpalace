import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  Star,
  SlidersHorizontal,
  Search,
  Heart,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

// Sample hardcoded products
const products = [
  {
    _id: "1",
    slug: "royal-canin-puppy",
    name: "Royal Canin Puppy Dog Food",
    brand: "Royal Canin",
    image: "/images/products/royal-canin-puppy.jpg",
    rating: 4.7,
    reviews: 120,
    discountedPrice: 1599,
    originalPrice: 1799,
    discount: 11,
  },
  {
    _id: "2",
    slug: "pedigree-puppy",
    name: "Pedigree Puppy Dry Dog Food",
    brand: "Pedigree",
    image: "/images/products/pedigree-puppy.jpg",
    rating: 4.5,
    reviews: 88,
    discountedPrice: 899,
    originalPrice: 999,
    discount: 10,
  },
  {
    _id: "3",
    slug: "drools-puppy",
    name: "Drools Focus Puppy Super Premium Food",
    brand: "Drools",
    image: "/images/products/drools-puppy.jpg",
    rating: 4.6,
    reviews: 105,
    discountedPrice: 1250,
    originalPrice: 1400,
    discount: 11,
  },
];

export default function CategoryPage() {
  const slug = ["dogs", "dog-food", "puppy-food"];

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

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar Filters */}
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
                    Puppy Food
                  </h1>
                  <p className="text-gray-600">
                    Showing {products.length} products
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <Card
                  key={product._id}
                  className="group hover:shadow-lg transition-all duration-300 bg-white border"
                >
                  <CardContent className="p-0">
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="relative overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={200}
                          height={160}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1">
                            {product.discount}% OFF
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
                        {product.brand}
                      </p>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 leading-tight hover:text-blue-600 transition-colors cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">
                          {product.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{product.discountedPrice}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
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
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Puppy Food - PetPalace",
  description: "Shop the best puppy food for your furry friends at PetPalace.",
};
