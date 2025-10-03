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
      codeBarGradient: "from-orange-500 to-orange-600",
    },
    {
      id: 2,
      name: "BUY 2 GET 1",
      discount: "FREE",
      promoCode: "BUY2GET1",
      bgGradient: "from-blue-100 to-blue-50",
      textColor: "text-blue-900",
      codeBarGradient: "from-blue-500 to-blue-600",
    },
    {
      id: 3,
      name: "FIRST ORDER",
      discount: "25% OFF",
      promoCode: "WELCOME25",
      bgGradient: "from-orange-100 to-orange-50",
      textColor: "text-orange-900",
      codeBarGradient: "from-orange-500 to-orange-600",
    },
    {
      id: 4,
      name: "HEALTH CARE",
      discount: "40% OFF",
      promoCode: "HEALTH40",
      bgGradient: "from-blue-100 to-blue-50",
      textColor: "text-blue-900",
      codeBarGradient: "from-blue-500 to-blue-600",
    },
    {
      id: 5,
      name: "PREMIUM PETS",
      discount: "30% OFF",
      promoCode: "PREMIUM30",
      bgGradient: "from-orange-100 to-orange-50",
      textColor: "text-orange-900",
      codeBarGradient: "from-orange-500 to-orange-600",
    },
    {
      id: 6,
      name: "TOP RATED",
      discount: "35% OFF",
      promoCode: "TOPRATED35",
      bgGradient: "from-blue-100 to-blue-50",
      textColor: "text-blue-900",
      codeBarGradient: "from-blue-500 to-blue-600",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="mb-8 space-y-2 animate-pulse">
            <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="border-0 shadow-sm rounded-2xl overflow-hidden animate-pulse"
              >
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200 relative"></div>
                  <div className="h-6 bg-gray-300 mt-2 mx-2 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Exclusive Pet Deals & Offers
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            Save big on premium pet products with our special discount codes
          </p>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {offers.map((offer) => (
            <Card
              key={offer.id}
              className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group"
            >
              <CardContent className="p-0">
                {/* Main Card Area */}
                <div
                  className={`aspect-square bg-gradient-to-br ${offer.bgGradient} p-2 sm:p-3 lg:p-6 relative flex flex-col justify-center`}
                >
                  <div className="text-center mb-1 sm:mb-2">
                    <div
                      className={`text-[9px] sm:text-xs lg:text-base font-bold ${offer.textColor} mb-1 tracking-wide`}
                    >
                      {offer.name}
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-[10px] sm:text-sm lg:text-3xl font-bold ${offer.textColor} leading-tight`}
                    >
                      {offer.discount}
                    </div>
                  </div>
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 lg:top-4 lg:right-4 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white/30 rounded-full"></div>
                </div>

                {/* Promo Code Bar */}
                <div
                  className={`bg-gradient-to-r ${offer.codeBarGradient} px-2 sm:px-3 lg:px-4 py-1 sm:py-2 lg:py-3 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity`}
                  onClick={() => copyToClipboard(offer.promoCode)}
                >
                  <span className="text-white font-medium text-[9px] sm:text-xs lg:text-base">
                    Use: {offer.promoCode}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 p-0 hover:bg-white/20 text-white"
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
