"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<
    { _id: string; image: string; alt: string; link: string }[]
  >([]);

  // Fetch sliders from API
  useEffect(() => {
    async function fetchSliders() {
      try {
        const res = await fetch("/api/sliders");
        const data = await res.json();
        setSlides(
          data.map((slide: any) => ({
            _id: slide._id,
            image: slide.image,
            alt: slide.title || "Slider Image",
            link: slide.link || "#",
          }))
        );
      } catch (err) {
        console.error("Error fetching sliders:", err);
      }
    }
    fetchSliders();
  }, []);

  // Auto slide
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  if (slides.length === 0) return null; // Loading or empty state

  return (
    <section className="relative overflow-hidden">
      {/* Responsive Hero Banner Height */}
      <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full overflow-hidden">
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <a
              key={slide._id}
              href={slide.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 translate-x-0 z-10"
                  : "opacity-0 translate-x-full z-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                style={{ objectFit: "cover" }}
                priority={index === 0}
              />
              {/* <div className="absolute inset-0 bg-black/10"></div> */}
            </a>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg z-20 text-gray-700 hover:text-gray-900 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg z-20 text-gray-700 hover:text-gray-900 backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
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
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm z-20">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
