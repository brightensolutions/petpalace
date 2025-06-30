"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useRef } from "react";

export function VideoShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: "smooth" });
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
      title: "Pet Safety",
      videoUrl: "/placeholder.svg?height=400&width=225&text=Pet+Safety+Video",
    },
    {
      id: 7,
      title: "Puppy Care",
      videoUrl: "/placeholder.svg?height=400&width=225&text=Puppy+Care+Video",
    },
    {
      id: 8,
      title: "Senior Pet Care",
      videoUrl: "/placeholder.svg?height=400&width=225&text=Senior+Pet+Video",
    },
  ];

  return (
    <section className="py-12 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Pet Care Videos
          </h2>
          <p className="text-gray-600 text-lg">
            Learn from our experts and give your pets the best care
          </p>
        </div>

        {/* Video Slider Container */}
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

          {/* Scrollable Video Row */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-12"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex-shrink-0 min-w-[16.66%] max-w-[16.66%] px-1"
              >
                <div className="relative">
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
                </div>
                <div className="mt-3 text-center">
                  <h3 className="font-semibold text-gray-900 text-base">
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
