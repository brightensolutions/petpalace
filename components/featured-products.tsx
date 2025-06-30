"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

export function FeaturedProducts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const products = [
    {
      id: 1,
      name: "Royal Canin Adult Dog Food",
      price: 2499,
      originalPrice: 2999,
      image: "/products/product.webp",
    },
    {
      id: 2,
      name: "Interactive Puzzle Toy",
      price: 1299,
      originalPrice: 1599,
      image: "/products/product.webp",
    },
    {
      id: 3,
      name: "Premium Cat Litter",
      price: 899,
      originalPrice: 1099,
      image: "/products/product.webp",
    },
    {
      id: 4,
      name: "Dental Chew Sticks",
      price: 349,
      originalPrice: 399,
      image: "/products/product.webp",
    },
    {
      id: 5,
      name: "Automatic Water Fountain",
      price: 3499,
      originalPrice: 3999,
      image: "/products/product.webp",
    },
    {
      id: 6,
      name: "Cozy Pet Bed",
      price: 1899,
      originalPrice: 2299,
      image: "/products/product.webp",
    },
    {
      id: 7,
      name: "Premium Dog Collar",
      price: 1599,
      originalPrice: 1899,
      image: "/products/product.webp",
    },
    {
      id: 8,
      name: "Cat Scratching Post",
      price: 2299,
      originalPrice: 2699,
      image: "/products/product.webp",
    },
  ];

  return (
    <section className="py-12 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Bestsellers Under ₹399
          </h2>
          <p className="text-lg text-gray-600">
            Discover our most popular products loved by pet parents across India
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-gray-100 rounded-full shadow border"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-gray-100 rounded-full shadow border"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </Button>

          {/* Products Row */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-12"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-300 bg-white hover:scale-105 flex-shrink-0 w-[22%] min-w-[220px]"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-36 py-3 text-base font-semibold shadow-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add
                      </Button>
                    </div>

                    <div className="text-base text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
