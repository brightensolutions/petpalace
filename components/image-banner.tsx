"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface ImageBannerProps {
  imageUrl?: string; // optional now
  linkUrl?: string;
}

export function ImageBanner({ imageUrl, linkUrl }: ImageBannerProps) {
  const [loading, setLoading] = useState(true);

  // Simulate image loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Skeleton loader
  if (loading) {
    return (
      <section className="py-6 bg-white w-full">
        <div className="w-full px-4">
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg bg-gray-200 animate-pulse"></div>
        </div>
      </section>
    );
  }

  // If no imageUrl provided, just render empty placeholder
  const bannerContent = (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg bg-gray-100">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Banner"
          fill
          className="object-cover"
          priority
          onLoadingComplete={() => setLoading(false)}
        />
      )}
    </div>
  );

  if (linkUrl) {
    return (
      <section className="py-6 bg-white w-full">
        <div className="w-full px-4">
          <a href={linkUrl} target="_blank" rel="noopener noreferrer">
            {bannerContent}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-white w-full">
      <div className="w-full px-4">{bannerContent}</div>
    </section>
  );
}

export default ImageBanner;
