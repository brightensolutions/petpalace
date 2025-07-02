"use client";

import { Card, CardContent } from "./ui/card";
import Image from "next/image";

export function CategoryShowcase() {
  const categories = [
    { id: 1, name: "Dog Food", image: "/categories/category.webp" },
    { id: 2, name: "Cat Food", image: "/categories/category.webp" },
    { id: 3, name: "Dog Toys", image: "/categories/category.webp" },
    { id: 4, name: "Cat Toys", image: "/categories/category.webp" },
    { id: 5, name: "Health Care", image: "/categories/category.webp" },
    { id: 6, name: "Grooming", image: "/categories/category.webp" },
    { id: 7, name: "Accessories", image: "/categories/category.webp" },
    { id: 8, name: "Treats", image: "/categories/category.webp" },
    { id: 9, name: "Beds & Furniture", image: "/categories/category.webp" },
    { id: 10, name: "Training", image: "/categories/category.webp" },
    { id: 11, name: "Carriers", image: "/categories/category.webp" },
    { id: 12, name: "Bowls & Feeders", image: "/categories/category.webp" },
    { id: 13, name: "Leashes", image: "/categories/category.webp" },
    { id: 14, name: "Collars", image: "/categories/category.webp" },
    { id: 15, name: "Cleaning", image: "/categories/category.webp" },
    { id: 16, name: "Supplements", image: "/categories/category.webp" },
  ];

  return (
    <section className="bg-white w-full pt-4 pb-4">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="mb-5 text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
            Trending Add-To-Carts
          </h2>
          <p className="text-gray-600 text-lg">Were you looking for these?</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col items-center">
              <Card className="w-full border border-gray-200 hover:border-orange-400 transition-all duration-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md group">
                {/* REMOVE ALL padding and margin */}
                <CardContent className="p-0 m-0">
                  <div className="relative w-full aspect-square bg-gradient-to-br from-orange-50 to-blue-50">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                    />
                  </div>
                </CardContent>
              </Card>
              {/* Original font size (text-base) */}
              <h3 className="mt-2 text-xl font-semibold text-gray-900 text-center group-hover:text-orange-600 transition-colors duration-300">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryShowcase;
