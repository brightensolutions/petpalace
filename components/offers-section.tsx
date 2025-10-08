"use client";

import { Card, CardContent } from "./ui/card";
import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export function OffersSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const offers = [
    {
      id: 1,
      name: "MEGA SALE",
      discount: "60% OFF",
      promoCode: "MEGA60",
      bgGradient: "from-orange-100 to-orange-50",
      textColor: "text-orange-900",
      borderColor: "border-orange-500",
      codeBarGradient: "from-orange-500 to-orange-600",
    },
    {
      id: 2,
      name: "BUY 2 GET 1",
      discount: "FREE",
      promoCode: "BUY2GET1",
      bgGradient: "from-blue-100 to-blue-50",
      textColor: "text-blue-900",
      borderColor: "border-blue-500",
      codeBarGradient: "from-blue-500 to-blue-600",
    },
    {
      id: 3,
      name: "FIRST ORDER",
      discount: "25% OFF",
      promoCode: "WELCOME25",
      bgGradient: "from-orange-100 to-orange-50",
      textColor: "text-orange-900",
      borderColor: "border-orange-500",
      codeBarGradient: "from-orange-500 to-orange-600",
    },
    {
      id: 4,
      name: "HEALTH CARE",
      discount: "40% OFF",
      promoCode: "HEALTH40",
      bgGradient: "from-blue-100 to-blue-50",
      textColor: "text-blue-900",
      borderColor: "border-blue-500",
      codeBarGradient: "from-blue-500 to-blue-600",
    },
    {
      id: 5,
      name: "PREMIUM PETS",
      discount: "30% OFF",
      promoCode: "PREMIUM30",
      bgGradient: "from-orange-100 to-orange-50",
      textColor: "text-orange-900",
      borderColor: "border-orange-500",
      codeBarGradient: "from-orange-500 to-orange-600",
    },
    {
      id: 6,
      name: "TOP RATED",
      discount: "35% OFF",
      promoCode: "TOPRATED35",
      bgGradient: "from-blue-100 to-blue-50",
      textColor: "text-blue-900",
      borderColor: "border-blue-500",
      codeBarGradient: "from-blue-500 to-blue-600",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <section className="py-8 bg-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="mb-4 sm:mb-6">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="border-4 border-gray-300 shadow-lg rounded-3xl overflow-hidden animate-pulse"
              >
                <CardContent className="p-0">
                  <div className="h-24 bg-gray-200 w-full rounded-3xl"></div>
                  <div className="h-3 w-2/3 bg-gray-300 rounded mx-auto mt-2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Exclusive Pet Deals & Offers
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            Save big on premium pet products with our special discount codes
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {offers.map((offer) => (
            <Card
              key={offer.id}
              className={`border-4 ${offer.borderColor} hover:border-opacity-90 transition-all duration-300 shadow-lg rounded-3xl overflow-hidden group`}
            >
              <CardContent className="p-0">
                {/* Main Card Area */}
                <div
                  className={`w-full bg-gradient-to-br ${offer.bgGradient} flex flex-col justify-center relative 
                    h-20 sm:h-24 lg:h-32 px-2 sm:px-3 py-1 sm:py-2 lg:py-4`}
                >
                  <div className="text-center">
                    <div
                      className={`text-[9px] sm:text-xs lg:text-base font-bold ${offer.textColor} tracking-wide`}
                    >
                      {offer.name}
                    </div>
                    <div
                      className={`text-[10px] sm:text-sm lg:text-2xl font-bold ${offer.textColor} leading-tight`}
                    >
                      {offer.discount}
                    </div>
                  </div>
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 lg:top-3 lg:right-3 w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/30 rounded-full"></div>
                </div>

                {/* Promo Code Bar */}
                <div
                  className={`bg-gradient-to-r ${offer.codeBarGradient} px-2 py-1 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity`}
                  onClick={() => copyToClipboard(offer.promoCode)}
                >
                  <span className="text-white font-medium text-[9px] sm:text-xs lg:text-sm">
                    Use: {offer.promoCode}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 p-0 hover:bg-white/20 text-white"
                  >
                    {copiedCode === offer.promoCode ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OffersSection;
