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

export function PetToysSection() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
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
      reviews: 856,
      image: "/products/toy.webp",
      badge: "Bestseller",
      category: "interactive",
      features: ["IQ Boost", "Treat Dispenser", "Durable"],
    },
    {
      id: 2,
      name: "Rainbow Rope Toy",
      brand: "KONG",
      price: 599,
      originalPrice: 799,
      discount: 25,
      rating: 4.6,
      reviews: 1234,
      image: "/products/toy.webp",
      badge: "Popular",
      category: "chew",
      features: ["Dental Health", "Natural Cotton", "Strong"],
    },
    {
      id: 3,
      name: "Squeaky Duck Family",
      brand: "ZippyPaws",
      price: 399,
      originalPrice: 499,
      discount: 20,
      rating: 4.5,
      reviews: 567,
      image: "/products/toy.webp",
      badge: "New",
      category: "plush",
      features: ["Soft & Safe", "Fun Sounds", "Washable"],
    },
    {
      id: 4,
      name: "Magic Feather Wand",
      brand: "Cat Dancer",
      price: 299,
      originalPrice: 399,
      discount: 25,
      rating: 4.7,
      reviews: 432,
      image: "/products/toy.webp",
      badge: "Top Rated",
      category: "interactive",
      features: ["Cat Favorite", "Exercise", "Bonding"],
    },
    {
      id: 5,
      name: "Treat Puzzle Dispenser",
      brand: "PetSafe",
      price: 1899,
      originalPrice: 2299,
      discount: 17,
      rating: 4.4,
      reviews: 789,
      image: "/products/toy.webp",
      badge: "Smart",
      category: "interactive",
      features: ["Auto Dispense", "Timer", "App Control"],
    },
    {
      id: 6,
      name: "Cuddle Elephant",
      brand: "BarkBox",
      price: 799,
      originalPrice: 999,
      discount: 20,
      rating: 4.3,
      reviews: 345,
      image: "/products/toy.webp",
      badge: "Comfort",
      category: "plush",
      features: ["Super Soft", "Calming", "Hypoallergenic"],
    },
    {
      id: 7,
      name: "Laser Chase Pro",
      brand: "PetLaser",
      price: 499,
      originalPrice: 699,
      discount: 29,
      rating: 4.5,
      reviews: 678,
      image: "/products/toy.webp",
      badge: "Active",
      category: "interactive",
      features: ["Auto Mode", "Safe Laser", "Exercise"],
    },
    {
      id: 8,
      name: "Flying Frisbee",
      brand: "ChuckIt!",
      price: 699,
      originalPrice: 899,
      discount: 22,
      rating: 4.6,
      reviews: 234,
      image: "/products/toy.webp",
      badge: "Outdoor",
      category: "outdoor",
      features: ["Floats", "Glow Dark", "Aerodynamic"],
    },
  ];

  const filteredToys =
    activeCategory === "all"
      ? toys
      : toys.filter((toy) => toy.category === activeCategory);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-orange-50 w-full relative overflow-hidden">
      {/* Light Pet Toy Graphics Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {/* Ball Toys */}
        <div className="absolute top-20 left-10">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="35" fill="#3b82f6" />
            <circle
              cx="40"
              cy="40"
              r="25"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle
              cx="40"
              cy="40"
              r="15"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle cx="40" cy="40" r="5" fill="#ffffff" />
          </svg>
        </div>

        {/* Bone Shape */}
        <div className="absolute top-32 right-20">
          <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
            <path
              d="M15 20C15 11.7157 21.7157 5 30 5C38.2843 5 45 11.7157 45 20C45 28.2843 38.2843 35 30 35C21.7157 35 15 28.2843 15 20Z"
              fill="#f97316"
            />
            <rect x="30" y="15" width="40" height="10" fill="#f97316" />
            <path
              d="M55 20C55 11.7157 61.7157 5 70 5C78.2843 5 85 11.7157 85 20C85 28.2843 78.2843 35 70 35C61.7157 35 55 28.2843 55 20Z"
              fill="#f97316"
            />
          </svg>
        </div>

        {/* Rope Toy */}
        <div className="absolute bottom-40 left-1/4">
          <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
            <path
              d="M20 10 Q30 20 20 30 Q10 40 20 50 Q30 60 20 70 Q10 80 20 90 Q30 100 20 110"
              stroke="#3b82f6"
              strokeWidth="8"
              fill="none"
            />
            <path
              d="M40 10 Q30 20 40 30 Q50 40 40 50 Q30 60 40 70 Q50 80 40 90 Q30 100 40 110"
              stroke="#3b82f6"
              strokeWidth="8"
              fill="none"
            />
          </svg>
        </div>

        {/* Frisbee */}
        <div className="absolute bottom-20 right-1/3">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
            <ellipse cx="45" cy="45" rx="40" ry="35" fill="#f97316" />
            <ellipse
              cx="45"
              cy="45"
              rx="30"
              ry="25"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
            />
            <ellipse
              cx="45"
              cy="45"
              rx="20"
              ry="15"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Mouse Toy */}
        <div className="absolute top-1/2 left-16">
          <svg width="70" height="50" viewBox="0 0 70 50" fill="none">
            <ellipse cx="35" cy="30" rx="25" ry="15" fill="#3b82f6" />
            <circle cx="25" cy="25" r="3" fill="#ffffff" />
            <path
              d="M10 30 Q5 25 10 20"
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M60 30 Q65 25 60 20"
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M35 45 Q40 50 45 45 Q50 40 55 45"
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </div>

        {/* Feather Toy */}
        <div className="absolute top-1/3 right-10">
          <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
            <path d="M30 90 L30 20" stroke="#f97316" strokeWidth="3" />
            <path d="M30 20 Q20 10 10 15 Q15 25 30 20" fill="#f97316" />
            <path d="M30 20 Q40 10 50 15 Q45 25 30 20" fill="#f97316" />
            <path d="M30 30 Q25 25 20 28 Q22 32 30 30" fill="#f97316" />
            <path d="M30 30 Q35 25 40 28 Q38 32 30 30" fill="#f97316" />
          </svg>
        </div>

        {/* Squeaky Toy */}
        <div className="absolute bottom-1/3 left-1/2">
          <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
            <ellipse cx="25" cy="40" rx="20" ry="15" fill="#3b82f6" />
            <ellipse cx="25" cy="25" rx="15" ry="12" fill="#3b82f6" />
            <circle cx="20" cy="22" r="2" fill="#ffffff" />
            <circle cx="30" cy="22" r="2" fill="#ffffff" />
            <path
              d="M15 30 Q25 35 35 30"
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* Additional scattered small toys */}
        <div className="absolute top-1/4 left-1/3">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="12" fill="#f97316" opacity="0.7" />
          </svg>
        </div>

        <div className="absolute bottom-1/4 right-1/4">
          <svg width="40" height="25" viewBox="0 0 40 25" fill="none">
            <ellipse
              cx="20"
              cy="12.5"
              rx="18"
              ry="10"
              fill="#3b82f6"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>

      <div className="w-full px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Special Pet Toys Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Keep your pets entertained with our curated selection of fun and
            interactive toys
          </p>

          {/* Category Filter */}
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

        {/* Toys Slider */}
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

          {/* Toys Container */}
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

                    {/* Simple Badge */}
                    <Badge className="absolute top-4 left-4 bg-blue-500 text-white text-xs px-3 py-1 shadow-lg border-0">
                      {toy.badge}
                    </Badge>

                    {/* Heart Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(toy.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-gray-50 rounded-full shadow-lg"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(toy.id)
                            ? "text-red-500 fill-current"
                            : "text-gray-600"
                        }`}
                      />
                    </Button>

                    {/* Quick Add Button */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 text-xs shadow-lg"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-blue-600 mb-1 font-medium">
                      {toy.brand}
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight">
                      {toy.name}
                    </h3>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {toy.features.slice(0, 2).map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-orange-400 fill-current" />
                        <span className="text-base text-gray-700 ml-1 font-medium">
                          {toy.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({toy.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{toy.price}
                      </span>
                      <span className="text-base text-gray-500 line-through">
                        ₹{toy.originalPrice}
                      </span>
                      <Badge className="text-sm bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
                        {toy.discount}% OFF
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            View All Toys
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PetToysSection;
