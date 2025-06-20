"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/placeholder.svg?height=500&width=1200&text=Pet+Sale+Banner",
      alt: "Pet Sale Banner",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=500&width=1200&text=Premium+Pet+Food",
      alt: "Premium Pet Food Banner",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=500&width=1200&text=Interactive+Pet+Toys",
      alt: "Interactive Pet Toys Banner",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=500&width=1200&text=Pet+Wellness+Center",
      alt: "Pet Wellness Center Banner",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Carousel Container */}
      <div className="relative h-[500px] w-full">
        {/* Slides */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 translate-x-0"
                  : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <img
                src={slide.image || "/placeholder.svg"}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
              {/* Optional overlay for better text readability if needed */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg z-10 text-gray-700 hover:text-gray-900 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg z-10 text-gray-700 hover:text-gray-900 backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
