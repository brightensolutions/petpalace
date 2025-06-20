"use client";

import Image from "next/image";

export function ImageBanner() {
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
          />

          {/* Optional overlay for text if needed */}
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
