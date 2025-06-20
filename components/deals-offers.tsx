"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, Zap, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export function DealsOffers() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const deals = [
    {
      id: 1,
      title: "Flash Sale",
      subtitle: "Up to 70% OFF",
      description: "Limited time offer on premium pet food",
      image: "/placeholder.svg?height=200&width=300&text=Flash+Sale",
      bgGradient: "from-red-500 to-pink-500",
      icon: Zap,
      buttonText: "Shop Now",
    },
    {
      id: 2,
      title: "Buy 2 Get 1 FREE",
      subtitle: "Pet Toys",
      description: "Mix and match any pet toys",
      image: "/placeholder.svg?height=200&width=300&text=Buy+2+Get+1",
      bgGradient: "from-blue-500 to-purple-500",
      icon: Gift,
      buttonText: "Grab Deal",
    },
    {
      id: 3,
      title: "Weekend Special",
      subtitle: "Extra 25% OFF",
      description: "On grooming essentials",
      image: "/placeholder.svg?height=200&width=300&text=Weekend+Special",
      bgGradient: "from-green-500 to-teal-500",
      icon: Clock,
      buttonText: "Shop Weekend",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {"Today's Best Deals"}
          </h2>
          <p className="text-gray-600">
            {"Don't miss out on these amazing offers!"}
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-orange-200">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                ⚡ FLASH SALE ENDS IN
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="bg-orange-500 text-white rounded-lg px-3 py-2 text-2xl font-bold min-w-[60px]">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-xs text-gray-600 mt-1">Hours</div>
              </div>
              <div className="text-orange-500 text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="bg-orange-500 text-white rounded-lg px-3 py-2 text-2xl font-bold min-w-[60px]">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-xs text-gray-600 mt-1">Minutes</div>
              </div>
              <div className="text-orange-500 text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="bg-orange-500 text-white rounded-lg px-3 py-2 text-2xl font-bold min-w-[60px]">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-xs text-gray-600 mt-1">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card
              key={deal.id}
              className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
            >
              <CardContent className="p-0">
                <div
                  className={`bg-gradient-to-br ${deal.bgGradient} p-6 text-white relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <deal.icon className="w-6 h-6" />
                      <Badge className="bg-white/20 text-white border-white/30">
                        Limited Time
                      </Badge>
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{deal.title}</h3>
                    <div className="text-4xl font-bold mb-2">
                      {deal.subtitle}
                    </div>
                    <p className="text-white/90 mb-4">{deal.description}</p>
                    <Button
                      className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                      size="lg"
                    >
                      {deal.buttonText}
                    </Button>
                  </div>

                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                </div>

                <div className="p-4">
                  <Image
                    src={deal.image || "/placeholder.svg"}
                    alt={deal.title}
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DealsOffers;
