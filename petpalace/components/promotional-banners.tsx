"use client";

import { Card } from "./ui/card";

export function PromotionalBanners() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Bank Offer Banner */}
      <Card
        className="p-6 text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--color-secondary, #f97316) 0%, var(--color-secondary-dark, #c2410c) 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">🏦 HDFC Bank</div>
            <div className="text-2xl">
              <span className="text-3xl font-bold">Extra 5% OFF</span>
              <div className="text-base opacity-90">
                On HDFC Bank Credit Cards On Orders Above ₹2000
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-75">*T&C APPLIED</div>
          </div>
        </div>
      </Card>

      {/* Category Promotions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cat Supplies */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-200 to-yellow-400 p-8">
          <div className="relative z-10">
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-600 mb-2">
                LOWEST PRICE
              </div>
              <div className="text-4xl font-bold text-orange-700 mb-2">
                ON CAT
              </div>
              <div className="text-4xl font-bold text-orange-700 mb-4">
                SUPPLIES
              </div>
              <div className="bg-gray-800 text-white px-4 py-2 rounded-full inline-block text-xl font-bold">
                upto 60% off
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-6xl opacity-20">🐱</div>
        </Card>

        {/* Dog Supplies */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-200 to-blue-400 p-8">
          <div className="relative z-10">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">
                BEST DEALS
              </div>
              <div className="text-4xl font-bold text-white mb-2">ON DOG</div>
              <div className="text-4xl font-bold text-white mb-4">
                ESSENTIALS
              </div>
              <div
                className="text-white px-4 py-2 rounded-full inline-block text-xl font-bold"
                style={{ backgroundColor: "var(--color-secondary, #f97316)" }}
              >
                upto 50% off
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-6xl opacity-20">🐕</div>
        </Card>
      </div>

      {/* Featured Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: "Food & Treats", icon: "🍖", color: "bg-blue-100" },
          { name: "Toys & Games", icon: "🎾", color: "bg-orange-100" },
          { name: "Health Care", icon: "💊", color: "bg-yellow-100" },
          { name: "Accessories", icon: "🎀", color: "bg-blue-100" },
        ].map((category, index) => (
          <Card
            key={index}
            className={`${category.color} p-6 text-center hover:shadow-lg transition-shadow cursor-pointer`}
          >
            <div className="text-4xl mb-2">{category.icon}</div>
            <div className="font-semibold text-gray-700 text-base">
              {category.name}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PromotionalBanners;
