"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function ImageBanner() {
  const [loading, setLoading] = useState(true);

  // Simulate image loading (replace with actual onLoad if needed)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white w-full">
        <div className="w-full px-4">
          {/* Skeleton Banner */}
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg bg-gray-200 animate-pulse">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <div className="h-8 w-2/3 bg-gray-300 rounded-md mb-4 animate-pulse"></div>
              <div className="h-5 w-1/2 bg-gray-300 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white w-full">
      <div className="w-full px-4">
        {/* Simple Image Banner */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/placeholder.svg?height=400&width=1200&text=Pet+Care+Banner"
            alt="Pet Care Banner"
            fill
            className="object-cover"
            priority
            onLoadingComplete={() => setLoading(false)}
          />

          {/* Overlay Text */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-3xl md:text-5xl font-bold mb-2">
                Premium Pet Care
              </h3>
              <p className="text-xl md:text-2xl">
                Everything your pet needs in one place
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImageBanner;
