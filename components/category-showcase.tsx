"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  image?: string;
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
    <section className="bg-white w-full py-10">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="mb-5 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Trending Add-To-Carts
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl font-medium">
            Were you looking for these?
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center animate-pulse"
                >
                  <Card className="w-full rounded-2xl overflow-hidden shadow-lg h-20 sm:h-24 md:h-28 bg-[theme('colors.orange.400')]">
                    <CardContent className="p-0 m-0">
                      <div className="relative w-full h-full bg-[theme('colors.orange.400')] rounded-2xl"></div>
                    </CardContent>
                  </Card>
                  <div className="mt-2 h-3 sm:h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
              ))
            : categories.map((category) => (
                <div key={category._id} className="flex flex-col items-center">
                  <Card className="w-full rounded-2xl overflow-hidden shadow-lg bg-[theme('colors.orange.400')] hover:shadow-xl group">
                    <CardContent className="p-0 m-0">
                      <div className="relative w-full aspect-square">
                        <Image
                          src={category.image || "/categories/category.webp"}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <h3 className="mt-2 text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-gray-900 text-center group-hover:text-orange-600 transition-colors duration-300">
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
