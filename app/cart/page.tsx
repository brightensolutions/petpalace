"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Shield,
  RotateCcw,
  CreditCard,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  inStock: boolean;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Royal Canin Adult Dog Food - Chicken & Rice",
      price: 1299,
      originalPrice: 1499,
      image: "/placeholder.svg?height=120&width=120&text=Dog+Food",
      quantity: 2,
      category: "Dog Food",
      inStock: true,
    },
    {
      id: "2",
      name: "Interactive Puzzle Toy for Dogs",
      price: 599,
      image: "/placeholder.svg?height=120&width=120&text=Dog+Toy",
      quantity: 1,
      category: "Dog Toys",
      inStock: true,
    },
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 99;
  const total = subtotal + deliveryFee;

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Modern Checkout Progress Steps */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
                  <div className="h-full w-1/3 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out"></div>
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {/* Step 1 - Cart */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg ring-4 ring-orange-100 transition-all duration-300">
                      <Check className="w-5 h-5" />
                    </div>
                    <div className="mt-3 text-center">
                      <div className="font-semibold text-orange-600 text-sm">
                        Cart
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Review items
                      </div>
                    </div>
                  </div>

                  {/* Step 2 - Address */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-semibold text-sm shadow-sm transition-all duration-300 hover:border-orange-300 hover:shadow-md">
                      2
                    </div>
                    <div className="mt-3 text-center">
                      <div className="font-medium text-gray-500 text-sm">
                        Address
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Delivery details
                      </div>
                    </div>
                  </div>

                  {/* Step 3 - Payment */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-semibold text-sm shadow-sm transition-all duration-300 hover:border-orange-300 hover:shadow-md">
                      3
                    </div>
                    <div className="mt-3 text-center">
                      <div className="font-medium text-gray-500 text-sm">
                        Payment
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Secure checkout
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty Cart Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Animated Pet Graphics Background */}
            <div className="relative mb-8">
              <div className="absolute inset-0 overflow-hidden">
                {/* Dog Graphic - Left Side */}
                <div
                  className="absolute top-16 left-8 opacity-5 animate-bounce"
                  style={{ animationDelay: "0s", animationDuration: "4s" }}
                >
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 200 200"
                    fill="currentColor"
                    className="text-gray-400"
                  >
                    <path d="M100 40c-20 0-35 10-45 25l-10-15c-3-5-10-5-13 0s-5 10 0 13l15 20c-3 5-5 12-5 18 0 25 20 45 45 45s45-20 45-45c0-6-2-13-5-18l15-20c5-3 3-10 0-13s-10-5-13 0l-10 15c-10-15-25-25-45-25zm-15 40c3 0 6 3 6 6s-3 6-6 6-6-3-6-6 3-6 6-6zm30 0c3 0 6 3 6 6s-3 6-6 6-6-3-6-6 3-6 6-6zm-15 15c5 0 10 2 13 5l-5 5c-2-2-5-3-8-3s-6 1-8 3l-5-5c3-3 8-5 13-5z" />
                    <ellipse cx="100" cy="140" rx="35" ry="15" opacity="0.3" />
                    <path d="M70 120c0 8 5 15 12 18 3 1 6 2 9 2h16c3 0 6-1 9-2 7-3 12-10 12-18" />
                    <circle cx="85" cy="75" r="3" />
                    <circle cx="115" cy="75" r="3" />
                  </svg>
                </div>

                {/* Cat Graphic - Right Side */}
                <div
                  className="absolute top-20 right-12 opacity-5 animate-pulse"
                  style={{ animationDelay: "2s", animationDuration: "5s" }}
                >
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 200 200"
                    fill="currentColor"
                    className="text-gray-400"
                  >
                    <path d="M100 30c-15 0-28 6-35 15l-8-12c-3-4-8-4-11 0s-4 8 0 11l12 18c-2 4-3 9-3 14 0 20 16 36 36 36s36-16 36-36c0-5-1-10-3-14l12-18c4-3 3-8 0-11s-8-4-11 0l-8 12c-7-9-20-15-35-15z" />
                    <path d="M75 25l10 15 15-15c2-2 2-5 0-7s-5-2-7 0l-8 8-8-8c-2-2-5-2-7 0s-2 5 0 7z" />
                    <path d="M125 25l10 15 15-15c2-2 2-5 0-7s-5-2-7 0l-8 8-8-8c-2-2-5-2-7 0s-2 5 0 7z" />
                    <circle cx="85" cy="65" r="2" />
                    <circle cx="115" cy="65" r="2" />
                    <path d="M100 75c2 0 4 1 5 2l-2 2c-1-1-2-1-3-1s-2 0-3 1l-2-2c1-1 3-2 5-2z" />
                    <ellipse cx="100" cy="110" rx="25" ry="10" opacity="0.3" />
                    <path d="M85 95c0 5 3 9 7 11 2 1 4 1 6 1h4c2 0 4 0 6-1 4-2 7-6 7-11" />
                  </svg>
                </div>

                {/* Small Dog - Bottom Left */}
                <div
                  className="absolute bottom-32 left-16 opacity-5 animate-bounce"
                  style={{ animationDelay: "1s", animationDuration: "3s" }}
                >
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 150 150"
                    fill="currentColor"
                    className="text-gray-400"
                  >
                    <ellipse cx="75" cy="60" rx="25" ry="20" />
                    <ellipse cx="75" cy="90" rx="20" ry="25" />
                    <circle cx="65" cy="55" r="2" />
                    <circle cx="85" cy="55" r="2" />
                    <path d="M75 65c1 0 2 0 3 1l-1 1c0 0-1 0-2 0s-2 0-2 0l-1-1c1-1 2-1 3-1z" />
                    <ellipse
                      cx="50"
                      cy="70"
                      rx="8"
                      ry="15"
                      transform="rotate(-20 50 70)"
                    />
                    <ellipse
                      cx="100"
                      cy="70"
                      rx="8"
                      ry="15"
                      transform="rotate(20 100 70)"
                    />
                    <ellipse cx="60" cy="110" rx="5" ry="12" />
                    <ellipse cx="90" cy="110" rx="5" ry="12" />
                    <path d="M75 100c0 3 2 6 4 7 1 0 2 1 3 1h2c1 0 2-1 3-1 2-1 4-4 4-7" />
                  </svg>
                </div>

                {/* Small Cat - Bottom Right */}
                <div
                  className="absolute bottom-28 right-20 opacity-5 animate-pulse"
                  style={{ animationDelay: "3s", animationDuration: "4s" }}
                >
                  <svg
                    width="70"
                    height="70"
                    viewBox="0 0 140 140"
                    fill="currentColor"
                    className="text-gray-400"
                  >
                    <ellipse cx="70" cy="55" rx="20" ry="18" />
                    <ellipse cx="70" cy="80" rx="15" ry="20" />
                    <path d="M55 40l8 12 12-12c1-1 1-3 0-4s-3-1-4 0l-6 6-6-6c-1-1-3-1-4 0s-1 3 0 4z" />
                    <path d="M85 40l8 12 12-12c1-1 1-3 0-4s-3-1-4 0l-6 6-6-6c-1-1-3-1-4 0s-1 3 0 4z" />
                    <circle cx="63" cy="50" r="1.5" />
                    <circle cx="77" cy="50" r="1.5" />
                    <path d="M70 58c1 0 2 0 2 1l-1 1c0 0-1 0-1 0s-1 0-1 0l-1-1c0-1 1-1 2-1z" />
                    <ellipse
                      cx="55"
                      cy="65"
                      rx="6"
                      ry="12"
                      transform="rotate(-15 55 65)"
                    />
                    <ellipse
                      cx="85"
                      cy="65"
                      rx="6"
                      ry="12"
                      transform="rotate(15 85 65)"
                    />
                  </svg>
                </div>

                {/* Paw Prints */}
                <div
                  className="absolute top-40 left-1/3 opacity-5 animate-pulse"
                  style={{ animationDelay: "0.5s", animationDuration: "6s" }}
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 50 50"
                    fill="currentColor"
                    className="text-gray-400"
                  >
                    <ellipse cx="25" cy="15" rx="4" ry="6" />
                    <ellipse cx="15" cy="25" rx="3" ry="4" />
                    <ellipse cx="35" cy="25" rx="3" ry="4" />
                    <ellipse cx="20" cy="35" rx="2.5" ry="3" />
                    <ellipse cx="30" cy="35" rx="2.5" ry="3" />
                    <ellipse cx="25" cy="40" rx="6" ry="4" />
                  </svg>
                </div>

                <div
                  className="absolute bottom-40 right-1/3 opacity-5 animate-bounce"
                  style={{ animationDelay: "2.5s", animationDuration: "4s" }}
                >
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 50 50"
                    fill="currentColor"
                    className="text-gray-400"
                  >
                    <ellipse cx="25" cy="15" rx="3" ry="5" />
                    <ellipse cx="17" cy="23" rx="2.5" ry="3.5" />
                    <ellipse cx="33" cy="23" rx="2.5" ry="3.5" />
                    <ellipse cx="21" cy="32" rx="2" ry="2.5" />
                    <ellipse cx="29" cy="32" rx="2" ry="2.5" />
                    <ellipse cx="25" cy="37" rx="5" ry="3" />
                  </svg>
                </div>

                {/* Bone Graphics */}
                <div
                  className="absolute top-60 right-1/4 opacity-5 animate-pulse"
                  style={{ animationDelay: "1.5s", animationDuration: "5s" }}
                >
                  <svg
                    width="60"
                    height="20"
                    viewBox="0 0 100 30"
                    fill="currentColor"
                    className="text-gray-400"
                  >
                    <ellipse cx="15" cy="15" rx="12" ry="8" />
                    <ellipse cx="85" cy="15" rx="12" ry="8" />
                    <rect x="20" y="12" width="60" height="6" rx="3" />
                    <ellipse cx="15" cy="10" rx="6" ry="4" />
                    <ellipse cx="15" cy="20" rx="6" ry="4" />
                    <ellipse cx="85" cy="10" rx="6" ry="4" />
                    <ellipse cx="85" cy="20" rx="6" ry="4" />
                  </svg>
                </div>

                {/* Fish Graphics */}
                <div
                  className="absolute bottom-50 left-1/4 opacity-5 animate-bounce"
                  style={{ animationDelay: "4s", animationDuration: "3.5s" }}
                >
                  <svg
                    width="50"
                    height="30"
                    viewBox="0 0 80 40"
                    fill="currentColor"
                    className="text-gray-400"
                  >
                    <ellipse cx="40" cy="20" rx="25" ry="12" />
                    <path d="M15 20l-10-8v6h-5v4h5v6l10-8z" />
                    <path d="M65 12l8-4-2 4 2 4-8-4z" />
                    <path d="M65 28l8 4-2-4 2-4-8 4z" />
                    <circle cx="50" cy="16" r="2" />
                    <path
                      d="M30 20c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5z"
                      opacity="0.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Main Content */}
              <div className="relative z-10 py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Cart</h1>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  Oops, your cart is feeling a bit light. Time to give it some
                  love and add some goodies!
                </p>

                <Link href="/">
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                    Continue shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {[
                {
                  icon: Shield,
                  title: "Trusted brands",
                  color: "text-blue-600",
                  bgColor: "bg-blue-100",
                },
                {
                  icon: RotateCcw,
                  title: "Free returns",
                  color: "text-orange-600",
                  bgColor: "bg-orange-100",
                },
                {
                  icon: CreditCard,
                  title: "Secure payments",
                  color: "text-green-600",
                  bgColor: "bg-green-100",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl ${item.bgColor} flex items-center justify-center mb-4`}
                  >
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Cart with items
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Modern Checkout Progress Steps */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
                <div className="h-full w-1/3 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out"></div>
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {/* Step 1 - Cart */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg ring-4 ring-orange-100 transition-all duration-300">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="mt-3 text-center">
                    <div className="font-semibold text-orange-600 text-sm">
                      Cart
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Review items
                    </div>
                  </div>
                </div>

                {/* Step 2 - Address */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-semibold text-sm shadow-sm transition-all duration-300 hover:border-orange-300 hover:shadow-md">
                    2
                  </div>
                  <div className="mt-3 text-center">
                    <div className="font-medium text-gray-500 text-sm">
                      Address
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Delivery details
                    </div>
                  </div>
                </div>

                {/* Step 3 - Payment */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-semibold text-sm shadow-sm transition-all duration-300 hover:border-orange-300 hover:shadow-md">
                    3
                  </div>
                  <div className="mt-3 text-center">
                    <div className="font-medium text-gray-500 text-sm">
                      Payment
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Secure checkout
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopping Cart ({cartItems.length} items)
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={120}
                        height={120}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.category}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xl font-bold text-gray-900">
                              ₹{item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold text-lg w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            ₹{item.price * item.quantity}
                          </p>
                          {item.inStock ? (
                            <p className="text-sm text-green-600">In Stock</p>
                          ) : (
                            <p className="text-sm text-red-600">Out of Stock</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You Save</span>
                      <span className="font-semibold">-₹{savings}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span
                      className={`font-semibold ${
                        deliveryFee === 0 ? "text-green-600" : ""
                      }`}
                    >
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {subtotal < 499 && (
                    <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                      Add ₹{499 - subtotal} more for FREE delivery!
                    </p>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mb-4">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>

                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl font-semibold"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
