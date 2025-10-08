"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export function FeaturedProducts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const width =
        window.innerWidth < 640
          ? scrollContainerRef.current.offsetWidth / 2
          : scrollContainerRef.current.offsetWidth / 6;
      scrollContainerRef.current.scrollBy({ left: -width, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const width =
        window.innerWidth < 640
          ? scrollContainerRef.current.offsetWidth / 2
          : scrollContainerRef.current.offsetWidth / 6;
      scrollContainerRef.current.scrollBy({ left: width, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    setShowLeftArrow(scrollContainerRef.current.scrollLeft > 0);
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-10 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
            Bestsellers Under ₹399
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
            Discover our most popular products loved by pet parents across India
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center">
          {/* Left Arrow */}
          {showLeftArrow && (
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollLeft}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200 z-10"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
            </Button>
          )}

          {/* Right Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollRight}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200 z-10"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </Button>

          {/* Product Row */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2 sm:px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card
                    key={i}
                    className="group flex-shrink-0 w-[48%] sm:w-[30%] lg:w-[18%] min-w-[160px] aspect-square animate-pulse snap-start bg-orange-100 border-none"
                  >
                    <CardContent className="p-0">
                      <div className="w-full h-full bg-orange-200"></div>
                    </CardContent>
                  </Card>
                ))
              : products.map((product) => (
                  <Card
                    key={product.id}
                    className="group hover:shadow-lg transition-all duration-300 border-none bg-orange-100 flex-shrink-0 w-[48%] sm:w-[30%] lg:w-[18%] min-w-[160px] aspect-square snap-start"
                  >
                    <CardContent className="p-0 flex flex-col">
                      <div className="relative overflow-hidden aspect-square">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-2 sm:p-3 flex flex-col justify-between flex-1">
                        <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-800 mb-1 line-clamp-2 leading-tight">
                          {product.name}
                        </h3>

                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm sm:text-lg font-bold text-gray-900">
                            ₹{product.price}
                          </span>
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-20 sm:w-28 md:w-32 py-1 sm:py-2 text-xs sm:text-sm md:text-base font-semibold shadow-lg flex items-center justify-center">
                            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1" />
                            Add
                          </Button>
                        </div>

                        <div className="text-xs sm:text-sm md:text-base text-gray-500 line-through">
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
