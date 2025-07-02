"use client";

import { Button } from "./ui/button";
import { ArrowRight, Gift, Star, Shield, Truck, Award } from "lucide-react";

export function PromotionalBanner() {
  return (
    <section className="py-16 bg-white w-full">
      <div className="w-full px-6">
        {/* Premium Promotional Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-blue-50 to-white shadow-xl border border-orange-100 max-w-7xl mx-auto">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-transparent rounded-full -translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-blue-200 to-transparent rounded-full translate-x-40 translate-y-40"></div>
          </div>

          <div className="relative z-10 text-center py-16 px-8 md:px-16">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-lg mb-8">
              <Gift className="w-5 h-5" />
              <span className="font-semibold">
                Exclusive Premium Collection
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6 mb-12">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
                Premium Pet Care
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-blue-600">
                  Redefined
                </span>
              </h2>
              <p className="text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Experience the finest collection of premium pet products,
                curated by experts and loved by pets across India
              </p>
            </div>

            {/* Premium Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: Truck,
                  title: "Premium Delivery",
                  desc: "White-glove delivery service for premium products",
                  color: "text-blue-600",
                },
                {
                  icon: Shield,
                  title: "Authenticity Guarantee",
                  desc: "100% authentic products with quality certification",
                  color: "text-green-600",
                },
                {
                  icon: Award,
                  title: "Expert Curated",
                  desc: "Hand-picked by veterinarians and pet experts",
                  color: "text-orange-600",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div
                    className={`w-16 h-16 ${feature.color} bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-12 py-4 text-xl shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full group"
              >
                Shop Premium Collection
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-bold px-12 py-4 text-xl transition-all duration-300 rounded-full"
              >
                Explore Catalog
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-orange-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-gray-700 font-medium">
                  4.9/5 Premium Rating
                </span>
              </div>
              <div className="text-gray-700">
                <span className="font-bold text-orange-600 text-xl">100K+</span>{" "}
                Premium Customers
              </div>
              <div className="text-gray-700">
                <span className="font-bold text-blue-600 text-xl">500+</span>{" "}
                Premium Products
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromotionalBanner;
