"use client";

import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: "🎉 Big Pet Festival",
      title: "SUPER CLEARANCE",
      subtitle: "SALE",
      description: "ENDING SOON!",
      image: "/images/hero-sale.png",
      buttons: [
        { text: "Shop Dogs", primary: true },
        { text: "Shop Cats", primary: false },
      ],
      bgGradient:
        "linear-gradient(135deg, var(--color-primary, #3b82f6) 0%, var(--color-secondary, #f97316) 100%)",
    },
    {
      id: 2,
      badge: "🐕 Premium Quality",
      title: "HEALTHY PET",
      subtitle: "FOOD",
      description: "UP TO 40% OFF",
      image: "/images/hero-food.png",
      buttons: [
        { text: "Shop Food", primary: true },
        { text: "View All", primary: false },
      ],
      bgGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      id: 3,
      badge: "🎾 Fun & Play",
      title: "INTERACTIVE",
      subtitle: "TOYS",
      description: "NEW ARRIVALS",
      image: "/images/hero-toys.png",
      buttons: [
        { text: "Shop Toys", primary: true },
        { text: "Learn More", primary: false },
      ],
      bgGradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      id: 4,
      badge: "💊 Health Care",
      title: "PET WELLNESS",
      subtitle: "CENTER",
      description: "FREE CONSULTATION",
      image: "/images/hero-wellness.png",
      buttons: [
        { text: "Book Now", primary: true },
        { text: "Health Tips", primary: false },
      ],
      bgGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
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
      <div className="relative h-[500px]">
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
              style={{
                background: slide.bgGradient,
              }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-300 rounded-full animate-bounce"></div>
                <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-orange-300 rounded-full animate-pulse"></div>
                <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/20 rounded-full animate-bounce"></div>
              </div>

              <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
                  {/* Content Side */}
                  <div className="text-center lg:text-left">
                    <div className="mb-6">
                      <span className="inline-block bg-yellow-400 text-gray-800 px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                        {slide.badge}
                      </span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                      {slide.title}
                      <br />
                      <span className="text-yellow-300">{slide.subtitle}</span>
                    </h1>
                    <div
                      className="text-white px-8 py-4 rounded-full inline-block text-xl font-bold mb-8 shadow-lg"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    >
                      {slide.description}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                      {slide.buttons.map((button, btnIndex) => (
                        <Button
                          key={btnIndex}
                          size="lg"
                          className={`px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                            button.primary
                              ? "bg-white text-gray-800 hover:bg-gray-100"
                              : "border-2 border-white text-white hover:bg-white hover:text-gray-800 bg-transparent"
                          }`}
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Image Side */}
                  <div className="flex justify-center lg:justify-end">
                    <div className="relative">
                      <img
                        src={slide.image || "/placeholder.svg"}
                        alt={`${slide.title} ${slide.subtitle}`}
                        className="w-full max-w-lg h-80 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                      />
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400 rounded-full -mb-16 -ml-16 opacity-20 animate-pulse"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-400 rounded-full -mt-20 -mr-20 opacity-20 animate-bounce"></div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full shadow-lg z-10 text-gray-700 hover:text-gray-900"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full shadow-lg z-10 text-gray-700 hover:text-gray-900"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute top-6 right-6 bg-black/30 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </section>
  );
}

// Also export as default
export default HeroBanner;
