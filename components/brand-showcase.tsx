"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { toast } from "sonner";

interface Brand {
  _id: string;
  name: string;
  image?: string;
  slug: string;
}

export function BrandShowcase() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brands");
        const json = await res.json();

        if (json.success) {
          setBrands(json.data);
        } else {
          toast.error(json.error || "Failed to load brands");
        }
      } catch (err) {
        toast.error("Error fetching brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <section className="bg-white w-full py-10">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Shop by Brands
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl font-medium">
            Trusted brands for your beloved pets
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center animate-pulse"
                >
                  <Card className="w-full rounded-2xl overflow-hidden shadow-md h-24 sm:h-28 md:h-32 bg-white border-2 border-gray-200">
                    <CardContent className="p-4 flex items-center justify-center h-full">
                      <div className="w-full h-full bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                  <div className="mt-2 h-3 sm:h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
              ))
            : brands.map((brand) => (
                <div
                  key={brand._id}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <Card className="w-full rounded-2xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-orange-400">
                    <CardContent className="p-4 flex items-center justify-center h-24 sm:h-28 md:h-32">
                      <div className="relative w-full h-full">
                        <Image
                          src={
                            brand.image ||
                            "/placeholder.svg?height=100&width=100"
                          }
                          alt={brand.name}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <h3 className="mt-2 text-xs sm:text-sm md:text-base font-semibold text-gray-900 text-center group-hover:text-orange-600 transition-colors duration-300">
                    {brand.name}
                  </h3>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export default BrandShowcase;
