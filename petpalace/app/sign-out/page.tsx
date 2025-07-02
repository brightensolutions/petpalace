"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignOutPage() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <Link href="/" className="block">
              <Image
                src="/images/logo.png"
                alt="PetPalace Logo"
                width={200}
                height={80}
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg text-center">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Successfully Signed Out
              </h1>
              <p className="text-green-100 text-lg">
                Thank you for visiting PetPalace!
              </p>
            </div>

            <div className="px-8 py-8">
              <div className="space-y-6">
                <div className="text-gray-600 text-lg leading-relaxed">
                  <p className="mb-4">
                    You have been safely signed out of your account.
                  </p>
                  <p>
                    We hope you found everything you needed for your furry
                    friends!
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-gray-700 font-medium mb-2">
                    Redirecting to homepage in:
                  </p>
                  <div className="text-4xl font-bold text-blue-600">
                    {countdown}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">seconds</p>
                </div>

                <div className="space-y-4">
                  <Link href="/" className="block">
                    <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                      <Home className="w-5 h-5 mr-2" />
                      Go to Homepage
                    </Button>
                  </Link>

                  <Link href="/sign-in" className="block">
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-xl border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 font-semibold text-base transition-all duration-200"
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Sign In Again
                    </Button>
                  </Link>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-4">
                    Quick Links:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/dogs"
                      className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-sm font-medium"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Shop Dogs
                    </Link>
                    <Link
                      href="/cats"
                      className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-sm font-medium"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Shop Cats
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-2">
                Thank You for Choosing PetPalace!
              </h3>
              <p className="text-gray-600 text-sm">
                We&apos;re committed to providing the best products for your
                beloved pets. Come back soon!
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                <span>🐕 5M+ Happy Pets</span>
                <span>🔒 Secure Shopping</span>
                <span>🚚 Free Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
