"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";

export function PetToysSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const categories = [
    { id: "all", name: "All Toys" },
    { id: "interactive", name: "Interactive" },
    { id: "chew", name: "Chew Toys" },
    { id: "plush", name: "Plush" },
    { id: "outdoor", name: "Outdoor" },
  ];

  const toys = [
    {
      id: 1,
      name: "Smart Puzzle Ball",
      brand: "Nina Ottosson",
      price: 1299,
      originalPrice: 1599,
      discount: 19,
      rating: 4.8,
      image: "/products/toy.webp",
      category: "interactive",
    },
    {
      id: 2,
      name: "Rainbow Rope Toy",
      brand: "KONG",
      price: 599,
      originalPrice: 799,
      discount: 25,
      rating: 4.6,
      image: "/products/toy.webp",
      category: "chew",
    },
    {
      id: 3,
      name: "Squeaky Duck Family",
      brand: "ZippyPaws",
      price: 399,
      originalPrice: 499,
      discount: 20,
      rating: 4.5,
      image: "/products/toy.webp",
      category: "plush",
    },
    {
      id: 4,
      name: "Magic Feather Wand",
      brand: "Cat Dancer",
      price: 299,
      originalPrice: 399,
      discount: 25,
      rating: 4.7,
      image: "/products/toy.webp",
      category: "interactive",
    },
    {
      id: 5,
      name: "Treat Puzzle Dispenser",
      brand: "PetSafe",
      price: 1899,
      originalPrice: 2299,
      discount: 17,
      rating: 4.4,
      image: "/products/toy.webp",
      category: "interactive",
    },
    {
      id: 6,
      name: "Cuddle Elephant",
      brand: "BarkBox",
      price: 799,
      originalPrice: 999,
      discount: 20,
      rating: 4.3,
      image: "/products/toy.webp",
      category: "plush",
    },
    {
      id: 7,
      name: "Laser Chase Pro",
      brand: "PetLaser",
      price: 499,
      originalPrice: 699,
      discount: 29,
      rating: 4.5,
      image: "/products/toy.webp",
      category: "interactive",
    },
    {
      id: 8,
      name: "Flying Frisbee",
      brand: "ChuckIt!",
      price: 699,
      originalPrice: 899,
      discount: 22,
      rating: 4.6,
      image: "/products/toy.webp",
      category: "outdoor",
    },
  ];

  const filteredToys =
    activeCategory === "all"
      ? toys
      : toys.filter((toy) => toy.category === activeCategory);

  return (
    <section className="relative py-16 w-full overflow-hidden bg-gradient-to-b from-yellow-50 via-orange-50 to-pink-50">
      {/* Decorative background graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
        <svg
          className="absolute top-10 left-10 w-24 h-24 text-orange-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M5.5 4C6.88 4 8 5.12 8 6.5S6.88 9 5.5 9 3 7.88 3 6.5 4.12 4 5.5 4zM18.5 4C19.88 4 21 5.12 21 6.5S19.88 9 18.5 9 16 7.88 16 6.5 17.12 4 18.5 4zM12 5C13.38 5 14.5 6.12 14.5 7.5S13.38 10 12 10 9.5 8.88 9.5 7.5 10.62 5 12 5zM7 12c1.66 0 3 1.34 3 3S8.66 18 7 18 4 16.66 4 15s1.34-3 3-3zM17 12c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
        </svg>
        <svg
          className="absolute bottom-12 right-16 w-32 h-12 text-blue-300 rotate-12"
          fill="currentColor"
          viewBox="0 0 100 40"
        >
          <path d="M15 20C15 11.7157 21.7157 5 30 5C38.2843 5 45 11.7157 45 20C45 28.2843 38.2843 35 30 35C21.7157 35 15 28.2843 15 20Z" />
          <rect x="30" y="15" width="40" height="10" />
          <path d="M55 20C55 11.7157 61.7157 5 70 5C78.2843 5 85 11.7157 85 20C85 28.2843 78.2843 35 70 35C61.7157 35 55 28.2843 55 20Z" />
        </svg>
      </div>

      <div className="w-full px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Special Pet Toys Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Keep your pets entertained with our curated selection of fun and
            interactive toys
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
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

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 px-12"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredToys.map((toy) => (
              <Card
                key={toy.id}
                className="group hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-300 bg-white hover:scale-105 flex-shrink-0 w-72 rounded-2xl overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={toy.image || "/placeholder.svg"}
                      alt={toy.name}
                      width={200}
                      height={200}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {toy.discount > 0 && (
                      <Badge className="absolute top-4 left-4 bg-green-500 text-white text-sm px-3 py-1 shadow-lg border-0 font-bold">
                        {toy.discount}% OFF
                      </Badge>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-blue-600 mb-1 font-medium">
                      {toy.brand}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight line-clamp-2">
                      {toy.name}
                    </h3>
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{toy.price}
                        </span>
                        {toy.originalPrice > toy.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{toy.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="ml-auto bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 text-sm flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
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
    </section>
  );
}

export default PetToysSection;
