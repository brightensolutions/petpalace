"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Star,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";

export function FeaturedProducts() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const products = [
    {
      id: 1,
      name: "Royal Canin Adult Dog Food",
      brand: "Royal Canin",
      price: 2499,
      originalPrice: 2999,
      discount: 17,
      rating: 4.5,
      reviews: 1234,
      image: "/placeholder.svg?height=200&width=200&text=Dog+Food",
      badge: "Bestseller",
      badgeColor: "bg-orange-500",
    },
    {
      id: 2,
      name: "Interactive Puzzle Toy",
      brand: "Nina Ottosson",
      price: 1299,
      originalPrice: 1599,
      discount: 19,
      rating: 4.7,
      reviews: 856,
      image: "/placeholder.svg?height=200&width=200&text=Dog+Toy",
      badge: "New",
      badgeColor: "bg-blue-500",
    },
    {
      id: 3,
      name: "Premium Cat Litter",
      brand: "World's Best",
      price: 899,
      originalPrice: 1099,
      discount: 18,
      rating: 4.3,
      reviews: 567,
      image: "/placeholder.svg?height=200&width=200&text=Cat+Litter",
      badge: "Eco-Friendly",
      badgeColor: "bg-orange-600",
    },
    {
      id: 4,
      name: "Dental Chew Sticks",
      brand: "Pedigree",
      price: 349,
      originalPrice: 399,
      discount: 13,
      rating: 4.2,
      reviews: 2341,
      image: "/placeholder.svg?height=200&width=200&text=Dental+Chews",
      badge: "Vet Recommended",
      badgeColor: "bg-blue-600",
    },
    {
      id: 5,
      name: "Automatic Water Fountain",
      brand: "PetSafe",
      price: 3499,
      originalPrice: 3999,
      discount: 13,
      rating: 4.6,
      reviews: 432,
      image: "/placeholder.svg?height=200&width=200&text=Water+Fountain",
      badge: "Smart",
      badgeColor: "bg-orange-500",
    },
    {
      id: 6,
      name: "Cozy Pet Bed",
      brand: "FurHaven",
      price: 1899,
      originalPrice: 2299,
      discount: 17,
      rating: 4.4,
      reviews: 789,
      image: "/placeholder.svg?height=200&width=200&text=Pet+Bed",
      badge: "Comfort+",
      badgeColor: "bg-blue-500",
    },
    {
      id: 7,
      name: "Premium Dog Collar",
      brand: "Ruffwear",
      price: 1599,
      originalPrice: 1899,
      discount: 16,
      rating: 4.5,
      reviews: 345,
      image: "/placeholder.svg?height=200&width=200&text=Dog+Collar",
      badge: "Durable",
      badgeColor: "bg-orange-500",
    },
    {
      id: 8,
      name: "Cat Scratching Post",
      brand: "SmartCat",
      price: 2299,
      originalPrice: 2699,
      discount: 15,
      rating: 4.6,
      reviews: 678,
      image: "/placeholder.svg?height=200&width=200&text=Cat+Scratch",
      badge: "Popular",
      badgeColor: "bg-blue-500",
    },
  ];

  return (
    <section className="py-12 bg-white w-full">
      <div className="w-full px-4">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600">
            Discover our most popular products loved by pet parents across India
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </Button>

          {/* Scrollable Products Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-12"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-300 bg-white hover:scale-105 flex-shrink-0 w-64"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge
                      className={`absolute top-3 left-3 ${product.badgeColor} text-white text-sm px-3 py-1 shadow-lg border-0`}
                    >
                      {product.badge}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white hover:bg-gray-50 rounded-full shadow-lg"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.includes(product.id)
                            ? "text-red-500 fill-current"
                            : "text-gray-600"
                        }`}
                      />
                    </Button>
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 text-xs shadow-lg"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="text-sm text-blue-600 mb-1 font-medium">
                      {product.brand}
                    </div>
                    <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-orange-400 fill-current" />
                        <span className="text-sm text-gray-700 ml-1 font-medium">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      <span className="text-base text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <Badge className="text-sm bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
