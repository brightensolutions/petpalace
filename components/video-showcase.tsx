"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState, useEffect } from "react";

export function VideoShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const width =
        window.innerWidth < 640
          ? scrollContainerRef.current.offsetWidth / 2
          : scrollContainerRef.current.offsetWidth / 6;
      scrollContainerRef.current.scrollBy({ left: -width, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const width =
        window.innerWidth < 640
          ? scrollContainerRef.current.offsetWidth / 2
          : scrollContainerRef.current.offsetWidth / 6;
      scrollContainerRef.current.scrollBy({ left: width, behavior: "smooth" });
    }
  };

  const videos = [
    {
      id: 1,
      title: "Pet Care Tips",
      videoUrl: "/placeholder.svg?height=400&width=225&text=Pet+Care+Video",
    },
    {
      id: 2,
      title: "Dog Training",
      videoUrl: "/placeholder.svg?height=400&width=225&text=Dog+Training+Video",
    },
    {
      id: 3,
      title: "Cat Grooming",
      videoUrl: "/placeholder.svg?height=400&width=225&text=Cat+Grooming+Video",
    },
    {
      id: 4,
      title: "Pet Nutrition",
      videoUrl:
        "/placeholder.svg?height=400&width=225&text=Pet+Nutrition+Video",
    },
    {
      id: 5,
      title: "Pet Exercise",
      videoUrl: "/placeholder.svg?height=400&width=225&text=Pet+Exercise+Video",
    },
    {
      id: 6,
      title: "Pet Training",
      videoUrl: "/placeholder.svg?height=400&width=225&text=Pet+Training+Video",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="mb-8">
            <div className="h-6 w-48 bg-gray-200 rounded-md mb-3 animate-pulse"></div>
            <div className="h-4 w-80 bg-gray-200 rounded-md animate-pulse"></div>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2 sm:px-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-1/2 sm:w-[calc(16.66%-0.8rem)] px-1"
              >
                <div
                  className="rounded-lg bg-gray-200 animate-pulse"
                  style={{ aspectRatio: "9/16" }}
                ></div>
                <div className="h-5 w-32 bg-gray-200 rounded-md mt-3 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Pet Care Videos
          </h2>
          <p className="text-gray-600 text-base sm:text-sm md:text-base">
            Learn from our experts and give your pets the best care
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </Button>

          {/* Scrollable Video Row */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2 sm:px-12"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex-shrink-0 w-1/2 sm:w-[calc(16.66%-0.8rem)] px-1"
              >
                <div
                  className="relative rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                  style={{ aspectRatio: "9/16" }}
                >
                  <video
                    className="w-full h-full object-cover cursor-pointer"
                    controls
                    preload="metadata"
                    poster={video.videoUrl}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="mt-3 text-center">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-base">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoShowcase;
