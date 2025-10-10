"use client";

import { Card, CardContent } from "./ui/card";
import { Copy, Check, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface Offer {
  _id: string;
  name: string;
  couponCode: string;
  type: "percentage" | "amount";
  description?: string;
  value: number;
}

export function OffersSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/offers");
        const data = await response.json();
        if (data.success) {
          setOffers(data.data.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const getThemeColors = (index: number) => {
    // Alternate: even = orange, odd = blue
    return index % 2 === 0
      ? {
          border: "border-orange-200",
          hover: "hover:border-orange-400",
          icon: "from-orange-400 to-orange-500",
        }
      : {
          border: "border-blue-200",
          hover: "hover:border-blue-400",
          icon: "from-blue-400 to-blue-500",
        };
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-orange-50 to-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="mb-4 sm:mb-6">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-5 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="border-2 border-gray-300 shadow-md rounded-2xl overflow-hidden animate-pulse"
              >
                <CardContent className="p-4">
                  <div className="h-16 bg-gray-200 w-full rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-orange-50 to-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-3xl sm:text-3xl lg:text-5xl font-extrabold mb-2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Exclusive Offers & Deals
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium">
            Save big with our special discount codes - Limited time only!
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
          {offers.map((offer, index) => {
            const discountText =
              offer.type === "percentage"
                ? `Extra ${offer.value}% off`
                : `Extra ₹${offer.value} off`;
            const theme = getThemeColors(index);

            return (
              <Card
                key={offer._id}
                className={`border-2 ${theme.border} ${theme.hover} hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white group`}
              >
                <CardContent className="p-3">
                  <div className="flex flex-col sm:flex-1 gap-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${theme.icon} rounded-lg flex items-center justify-center shadow-md`}
                      >
                        <Gift className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 truncate">
                        {offer.couponCode}
                      </span>
                      <button
                        onClick={() => copyToClipboard(offer.couponCode)}
                        className="text-xs border border-orange-500 px-2 py-1 rounded-md hover:bg-orange-500 hover:text-white transition"
                      >
                        {copiedCode === offer.couponCode ? (
                          <Check className="w-3 h-3 inline" />
                        ) : (
                          <Copy className="w-3 h-3 inline" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {discountText} {offer.description || offer.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mobile Carousel */}
        <div className="sm:hidden">
          <Swiper spaceBetween={12} slidesPerView={1.5}>
            {offers.map((offer, index) => {
              const discountText =
                offer.type === "percentage"
                  ? `Extra ${offer.value}% off`
                  : `Extra ₹${offer.value} off`;
              const theme = getThemeColors(index);

              return (
                <SwiperSlide key={offer._id}>
                  <Card
                    className={`border-2 ${theme.border} ${theme.hover} hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white group`}
                  >
                    <CardContent className="p-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${theme.icon} rounded-lg flex items-center justify-center shadow-md`}
                          >
                            <Gift className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-bold text-gray-900 truncate">
                            {offer.couponCode}
                          </span>
                          <button
                            onClick={() => copyToClipboard(offer.couponCode)}
                            className="text-xs border border-orange-500 px-2 py-1 rounded-md hover:bg-orange-500 hover:text-white transition"
                          >
                            {copiedCode === offer.couponCode ? (
                              <Check className="w-3 h-3 inline" />
                            ) : (
                              <Copy className="w-3 h-3 inline" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {discountText} {offer.description || offer.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default OffersSection;
