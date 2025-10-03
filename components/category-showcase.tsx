"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  image?: string; // optional if you have an image field in DB
}

export function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingCategories = async () => {
      try {
        const res = await fetch("/api/trending-categories");
        const json = await res.json();

        if (json.success) {
          setCategories(json.data);
        } else {
          toast.error("Failed to load trending categories");
        }
      } catch (err) {
        toast.error("Error fetching trending categories");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCategories();
  }, []);

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
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center animate-pulse"
                >
                  <Card className="w-full border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-28 sm:h-32 md:h-36">
                    <CardContent className="p-0 m-0">
                      <div className="relative w-full h-full bg-gray-200 rounded-2xl"></div>
                    </CardContent>
                  </Card>
                  <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
              ))
            : categories.map((category) => (
                <div key={category._id} className="flex flex-col items-center">
                  <Card className="w-full border border-gray-200 hover:border-orange-400 transition-all duration-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md group">
                    <CardContent className="p-0 m-0">
                      <div className="relative w-full aspect-square bg-gradient-to-br from-orange-50 to-blue-50">
                        <Image
                          src={category.image || "/categories/category.webp"} // fallback if no image
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                        />
                      </div>
                    </CardContent>
                  </Card>
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
