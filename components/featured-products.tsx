"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { addToCart } from "@/lib/services/cart-service";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  variants?: { label: string; price: number; salePrice?: number }[];
}

export function FeaturedProducts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    const width =
      window.innerWidth < 640
        ? scrollContainerRef.current.offsetWidth / 2
        : scrollContainerRef.current.offsetWidth / 6;
    scrollContainerRef.current.scrollBy({ left: -width, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    const width =
      window.innerWidth < 640
        ? scrollContainerRef.current.offsetWidth / 2
        : scrollContainerRef.current.offsetWidth / 6;
    scrollContainerRef.current.scrollBy({ left: width, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    setShowLeftArrow(scrollContainerRef.current.scrollLeft > 0);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
        price: product.salePrice || product.price,
        name: product.name,
        image: product.images[0],
        variantLabel: product.variants?.[0]?.label,
      });
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/bestsellers");
        const data = await res.json();
        if (data.success) setProducts(data.data);
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-24 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="mb-6 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Bestsellers
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium">
            Discover our most popular products loved by pet parents across India
          </p>
        </div>

        {/* Carousel + Grid */}
        <div className="relative flex items-center">
          {showLeftArrow && (
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollLeft}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-orange-50 rounded-full shadow-lg border border-orange-200 z-10"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={scrollRight}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-orange-50 rounded-full shadow-lg border border-orange-200 z-10"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
          </Button>

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2 sm:px-4"
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card
                    key={i}
                    className="group flex-shrink-0 w-[48%] sm:w-[30%] lg:w-[18%] min-w-[160px] aspect-square animate-pulse bg-orange-100"
                  >
                    <CardContent className="p-0">
                      <div className="w-full h-full bg-orange-200"></div>
                    </CardContent>
                  </Card>
                ))
              : products.map((product) => (
                  <Card
                    key={product._id}
                    className="group hover:shadow-lg transition-all duration-300 bg-orange-100 flex-shrink-0 w-[48%] sm:w-[30%] lg:w-[18%] min-w-[160px] aspect-square snap-start"
                  >
                    <CardContent className="p-0 flex flex-col">
                      <div className="relative overflow-hidden aspect-square">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
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
                            ₹{product.salePrice || product.price}
                          </span>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-20 sm:w-28 md:w-32 py-1 sm:py-2 text-xs sm:text-sm md:text-base font-semibold shadow-lg flex items-center justify-center"
                          >
                            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1" />
                            Add
                          </Button>
                        </div>
                        {product.salePrice && (
                          <div className="text-xs sm:text-sm md:text-base text-gray-500 line-through">
                            ₹{product.price}
                          </div>
                        )}
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
