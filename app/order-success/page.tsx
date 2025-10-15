"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CheckCircle2, Package, Home, ShoppingBag } from "lucide-react";

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 relative overflow-hidden">
      <Header />

      <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: [
                "#ff6b6b",
                "#4ecdc4",
                "#45b7d1",
                "#f9ca24",
                "#6c5ce7",
              ][Math.floor(Math.random() * 5)],
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 animate-bounce">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-in slide-in-from-bottom duration-700">
              Congratulations!
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-2 animate-in slide-in-from-bottom duration-700 delay-100">
              Your order has been placed successfully
            </p>
            <p className="text-gray-600 animate-in slide-in-from-bottom duration-700 delay-200">
              Thank you for shopping with us! We'll take great care of your
              order.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-8 animate-in slide-in-from-bottom duration-700 delay-300">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                  <Package className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Order Confirmed
                </h2>
                {orderNumber && (
                  <div className="inline-block bg-gradient-to-r from-orange-100 to-green-100 px-6 py-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Order ID</p>
                    <p className="text-2xl font-bold text-gray-900 font-mono">
                      {orderNumber}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4 border-t pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Order Received
                    </h3>
                    <p className="text-sm text-gray-600">
                      We've received your order and will start processing it
                      soon.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Processing</h3>
                    <p className="text-sm text-gray-600">
                      Your order will be packed with care and shipped within 1-2
                      business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Home className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delivery</h3>
                    <p className="text-sm text-gray-600">
                      Your order will be delivered to your doorstep. You'll
                      receive tracking updates via email.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom duration-700 delay-500">
            <Button
              onClick={() => router.push("/account")}
              className="h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
            >
              <Package className="w-5 h-5 mr-2" />
              View My Orders
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="h-12 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-600 animate-in fade-in duration-700 delay-700">
            <p>
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@petpalace.com"
                className="text-orange-600 hover:underline font-semibold"
              >
                support@petpalace.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s linear infinite;
        }

        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
