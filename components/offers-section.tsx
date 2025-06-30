"use client";

import { Card, CardContent } from "./ui/card";
import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function OffersSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  return (
    <section className="py-12 bg-white w-full">
      <div className="w-full px-10">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Exclusive Pet Deals & Offers
          </h2>
          <p className="text-gray-600 text-lg">
            Save big on premium pet products with our special discount codes
          </p>
        </div>

        {/* Offers Grid - Full Width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {offers.map((offer) => (
            <Card
              key={offer.id}
              className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group"
            >
              <CardContent className="p-0">
                {/* Main Card Area */}
                <div
                  className={`bg-gradient-to-br ${offer.bgGradient} p-6 relative h-40 flex flex-col justify-center`}
                >
                  {/* Offer Name */}
                  <div className="text-center mb-3">
                    <div
                      className={`text-base font-bold ${offer.textColor} mb-2 tracking-wide`}
                    >
                      {offer.name}
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${offer.textColor} leading-tight`}
                    >
                      {offer.discount}
                    </div>
                  </div>

                  {/* Simple Decorative Circle */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/30 rounded-full"></div>
                </div>

                {/* Promo Code Bar */}
                <div
                  className={`bg-gradient-to-r ${offer.codeBarGradient} px-4 py-3 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity`}
                  onClick={() => copyToClipboard(offer.promoCode)}
                >
                  <span className="text-white font-medium text-base">
                    Use: {offer.promoCode}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-white/20 text-white"
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
