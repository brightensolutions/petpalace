"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Truck,
  Shield,
  Headphones,
  Award,
  ArrowRight,
  Heart,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "ROYAL CLEARANCE",
      subtitle: "PALACE SALE",
      description: "UP TO 70% OFF ROYAL TREATS!",
      image: "/placeholder.svg?height=600&width=1200",
      primaryButton: { text: "Shop for Dogs", href: "/products/dogs" },
      secondaryButton: { text: "Shop for Cats", href: "/products/cats" },
      badge: "Royal Pet Sale Event",
      bgGradient: "from-blue-600 via-blue-700 to-blue-800",
    },
    {
      id: 2,
      title: "PREMIUM NUTRITION",
      subtitle: "FOR ROYAL PETS",
      description: "HEALTHY MEALS FOR HAPPY PETS",
      image: "/placeholder.svg?height=600&width=1200",
      primaryButton: { text: "Shop Premium Food", href: "/products/premium" },
      secondaryButton: { text: "Health Care", href: "/products/healthcare" },
      badge: "New Premium Collection",
      bgGradient: "from-orange-500 via-orange-600 to-orange-700",
    },
    {
      id: 3,
      title: "TOYS & TREATS",
      subtitle: "PLAYTIME PARADISE",
      description: "FUN & GAMES FOR EVERY PET",
      image: "/placeholder.svg?height=600&width=1200",
      primaryButton: { text: "Shop Toys", href: "/products/toys" },
      secondaryButton: { text: "Shop Treats", href: "/products/treats" },
      badge: "Play & Fun Collection",
      bgGradient: "from-blue-500 via-purple-600 to-blue-700",
    },
    {
      id: 4,
      title: "GROOMING ESSENTIALS",
      subtitle: "ROYAL BEAUTY",
      description: "KEEP YOUR PETS LOOKING ROYAL",
      image: "/placeholder.svg?height=600&width=1200",
      primaryButton: { text: "Shop Grooming", href: "/products/grooming" },
      secondaryButton: { text: "Accessories", href: "/products/accessories" },
      badge: "Beauty & Care Collection",
      bgGradient: "from-orange-400 via-pink-500 to-orange-600",
    },
  ];

  const categories = [
    {
      name: "Dog Food",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/dog-food",
    },
    {
      name: "Cat Food",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/cat-food",
    },
    {
      name: "Pet Treats",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/treats",
    },
    {
      name: "Toys & Play",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/toys",
    },
    {
      name: "Health Care",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/healthcare",
    },
    {
      name: "Grooming",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/grooming",
    },
    {
      name: "Accessories",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/accessories",
    },
    {
      name: "Premium Food",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/premium",
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Royal Canin Adult Dog Food - Premium Nutrition",
      price: 2999,
      originalPrice: 3499,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 128,
      badge: "Best Seller",
      discount: "14% OFF",
    },
    {
      id: 2,
      name: "Whiskas Cat Food Variety Pack - Complete Meal",
      price: 1899,
      originalPrice: 2299,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviews: 89,
      badge: "New Arrival",
      discount: "17% OFF",
    },
    {
      id: 3,
      name: "Pedigree Healthy Training Treats - Natural",
      price: 599,
      originalPrice: 799,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 256,
      badge: "Popular",
      discount: "25% OFF",
    },
    {
      id: 4,
      name: "Hill's Science Diet Premium Adult Formula",
      price: 4299,
      originalPrice: 4999,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      reviews: 67,
      badge: "Premium",
      discount: "14% OFF",
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "On orders above ₹999",
      color: "text-blue-600",
    },
    {
      icon: Shield,
      title: "100% Authentic",
      description: "Genuine products only",
      color: "text-orange-500",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Expert pet care advice",
      color: "text-blue-600",
    },
    {
      icon: Award,
      title: "Best Quality",
      description: "Premium pet supplies",
      color: "text-orange-500",
    },
  ];

  // Auto-slide functionality
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
    <div className="min-h-screen bg-white">
      {/* Hero Slider Section */}
      <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSlide
                ? "translate-x-0"
                : index < currentSlide
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <div
              className={`relative h-full bg-gradient-to-br ${slide.bgGradient}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-20">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                <div className="text-center text-white w-full">
                  <Badge className="bg-orange-500 text-white text-sm sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold mb-6 inline-flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    {slide.badge}
                  </Badge>
                  <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 text-white drop-shadow-2xl leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-orange-400 drop-shadow-lg">
                    {slide.subtitle}
                  </h2>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full inline-block text-lg sm:text-xl font-bold mb-8 sm:mb-10 shadow-lg">
                    {slide.description}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 max-w-md sm:max-w-none mx-auto">
                    <Button
                      size="lg"
                      className="bg-white text-blue-700 hover:bg-blue-50 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-full w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300"
                      asChild
                    >
                      <Link href={slide.primaryButton.href}>
                        {slide.primaryButton.text}
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      className="bg-orange-500 text-white hover:bg-orange-600 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-full w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300"
                      asChild
                    >
                      <Link href={slide.secondaryButton.href}>
                        {slide.secondaryButton.text}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-orange-400 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute top-20 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full opacity-60 animate-pulse delay-1000"></div>
              <div className="absolute bottom-10 left-20 w-20 h-20 sm:w-24 sm:h-24 bg-orange-300 rounded-full opacity-50 animate-pulse delay-500"></div>
              <div className="absolute bottom-20 right-10 w-8 h-8 sm:w-12 sm:h-12 bg-blue-300 rounded-full opacity-60 animate-pulse delay-700"></div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-orange-500 scale-125"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-4 sm:py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center text-white text-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="bg-white text-orange-600 px-4 py-2 rounded-full font-bold text-sm sm:text-base flex items-center gap-2">
              <Heart className="w-4 h-4" />
              SPECIAL OFFER
            </div>
            <span className="text-lg sm:text-xl font-bold">
              Extra 10% OFF on Credit Cards | Orders Above ₹1500
            </span>
            <span className="text-sm opacity-90 bg-blue-600 px-3 py-1 rounded-full">
              T&C Applied
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100">
                  <feature.icon
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.color} mx-auto mb-4`}
                  />
                  <h3 className="font-bold text-blue-800 text-sm sm:text-base md:text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-blue-800">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover premium products for your royal companions
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-200"
              >
                <div className="mb-4 relative overflow-hidden rounded-xl bg-white p-2">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={120}
                    height={120}
                    className="w-full h-16 sm:h-20 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-bold text-blue-800 text-sm sm:text-base group-hover:text-orange-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 sm:mb-16 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800 mb-2">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked favorites for your royal pets
              </p>
            </div>
            <Button
              variant="outline"
              className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-full font-semibold"
              asChild
            >
              <Link href="/products" className="flex items-center space-x-2">
                <span>View All Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-orange-200 bg-white overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {product.badge}
                    </Badge>
                    <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {product.discount}
                    </Badge>
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="font-bold text-blue-800 text-base sm:text-lg mb-3 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                      {product.name}
                    </h3>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? "text-orange-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2 font-medium">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-orange-600">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition-colors duration-300">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Join the Pet Palace Royal Family
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Get exclusive offers, expert pet care tips, and be the first to
              know about new arrivals
            </p>
            <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your royal email address"
                className="flex-1 px-6 py-4 rounded-full text-blue-800 text-base font-medium placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-300"
              />
              <Button className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                Join Now
              </Button>
            </div>
            <p className="text-sm text-blue-300 mt-4">
              {"Join 25,000+ happy pet parents who trust Pet Palace"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
