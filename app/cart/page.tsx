"use client";

import { useState, useEffect } from "react";
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
  Tag,
  Gift,
  Percent,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  getCart,
  updateCartItem,
  removeFromCart,
} from "@/lib/services/cart-service";

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

interface OfferProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  discount: number;
  rating: number;
  category: string;
}

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  minOrder: number;
  validUntil: string;
  bgColor: string;
  textColor: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Offer products data
  const offerProducts: OfferProduct[] = [
    {
      id: "offer1",
      name: "Premium Dog Treats - Chicken Flavor",
      price: 299,
      originalPrice: 399,
      image: "/placeholder.svg?height=200&width=200&text=Dog+Treats",
      discount: 25,
      rating: 4.5,
      category: "Dog Treats",
    },
    {
      id: "offer2",
      name: "Stainless Steel Dog Bowl Set",
      price: 599,
      originalPrice: 799,
      image: "/placeholder.svg?height=200&width=200&text=Dog+Bowl",
      discount: 25,
      rating: 4.7,
      category: "Dog Accessories",
    },
    {
      id: "offer3",
      name: "Dog Leash & Collar Combo",
      price: 899,
      originalPrice: 1199,
      image: "/placeholder.svg?height=200&width=200&text=Dog+Leash",
      discount: 25,
      rating: 4.6,
      category: "Dog Accessories",
    },
    {
      id: "offer4",
      name: "Dog Grooming Kit",
      price: 1299,
      originalPrice: 1699,
      image: "/placeholder.svg?height=200&width=200&text=Grooming+Kit",
      discount: 24,
      rating: 4.8,
      category: "Dog Grooming",
    },
  ];

  // Available coupons
  const availableCoupons: Coupon[] = [
    {
      id: "coupon1",
      code: "SAVE150",
      title: "Flat ₹150 OFF",
      description: "On orders above ₹999",
      discount: "₹150",
      minOrder: 999,
      validUntil: "31 Dec 2024",
      bgColor: "bg-gradient-to-r from-orange-100 to-orange-200",
      textColor: "text-orange-800",
    },
    {
      id: "coupon2",
      code: "FIRST20",
      title: "20% OFF",
      description: "First time buyers",
      discount: "20%",
      minOrder: 499,
      validUntil: "31 Dec 2024",
      bgColor: "bg-gradient-to-r from-blue-100 to-blue-200",
      textColor: "text-blue-800",
    },
    {
      id: "coupon3",
      code: "BULK25",
      title: "25% OFF",
      description: "On orders above ₹2499",
      discount: "25%",
      minOrder: 2499,
      validUntil: "31 Dec 2024",
      bgColor: "bg-gradient-to-r from-green-100 to-green-200",
      textColor: "text-green-800",
    },
  ];

  useEffect(() => {
    const loadCart = () => {
      const cart = getCart();
      const mappedItems = cart.map((item, index) => ({
        id: `${item.productId}-${index}`,
        name: item.name,
        price: item.price,
        originalPrice: undefined,
        image: item.image || "/placeholder.svg",
        quantity: item.quantity,
        category: item.brand || "Product",
        inStock: true,
      }));
      setCartItems(mappedItems);
      setLoading(false);
    };

    loadCart();

    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const updateQuantity = async (id: string, newQuantity: number) => {
    const index = cartItems.findIndex((item) => item.id === id);
    if (index === -1) return;

    if (newQuantity === 0) {
      await removeFromCart(index);
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      await updateCartItem(index, { quantity: newQuantity });
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = async (id: string) => {
    const index = cartItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      await removeFromCart(index);
      setCartItems(cartItems.filter((item) => item.id !== id));
    }
  };

  const addOfferToCart = (offer: OfferProduct) => {
    const newCartItem: CartItem = {
      id: offer.id,
      name: offer.name,
      price: offer.price,
      originalPrice: offer.originalPrice,
      image: offer.image,
      quantity: 1,
      category: offer.category,
      inStock: true,
    };
    setCartItems([...cartItems, newCartItem]);
  };

  const applyPromoCode = () => {
    const validCoupon = availableCoupons.find(
      (coupon) => coupon.code === promoCode.toUpperCase()
    );
    if (validCoupon && subtotal >= validCoupon.minOrder) {
      setAppliedPromo(promoCode.toUpperCase());
    }
  };

  const applyCoupon = (code: string) => {
    setPromoCode(code);
    setAppliedPromo(code);
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

  // Calculate promo discount
  let promoDiscount = 0;
  if (appliedPromo) {
    const coupon = availableCoupons.find((c) => c.code === appliedPromo);
    if (coupon) {
      if (coupon.code === "SAVE150") promoDiscount = 150;
      else if (coupon.code === "FIRST20")
        promoDiscount = Math.floor(subtotal * 0.2);
      else if (coupon.code === "BULK25")
        promoDiscount = Math.floor(subtotal * 0.25);
    }
  }

  const total = subtotal + deliveryFee - promoDiscount;

  // Empty cart state
  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative mb-8">
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Loading cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Cart with items
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopping Cart ({cartItems.length} items)
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={120}
                          height={120}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                      </div>
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
                              <p className="text-sm text-red-600">
                                Out of Stock
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Frequently Bought Together */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-orange-600" />
                    ABHI NAHI TO KABHI NAHI
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {offerProducts.slice(0, 4).map((offer) => (
                      <div
                        key={offer.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                      >
                        <div className="flex gap-3">
                          <Image
                            src={offer.image || "/placeholder.svg"}
                            alt={offer.name}
                            width={80}
                            height={80}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                              {offer.name}
                            </h3>
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">
                                {offer.rating}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-sm">
                                  ₹{offer.price}
                                </span>
                                <span className="text-xs text-gray-500 line-through ml-1">
                                  ₹{offer.originalPrice}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => addOfferToCart(offer)}
                                className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 h-7"
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Available Coupons */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-orange-600" />
                    Available Offers
                  </h2>
                  <div className="space-y-3">
                    {availableCoupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className={`${
                          coupon.bgColor
                        } rounded-lg p-3 border border-gray-200 ${
                          subtotal >= coupon.minOrder
                            ? "opacity-100"
                            : "opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Tag className={`w-4 h-4 ${coupon.textColor}`} />
                            <span
                              className={`font-bold text-sm ${coupon.textColor}`}
                            >
                              {coupon.code}
                            </span>
                          </div>
                          <Badge
                            className={`${coupon.textColor} bg-white/50 text-xs`}
                          >
                            {coupon.discount}
                          </Badge>
                        </div>
                        <p className={`text-xs ${coupon.textColor} mb-2`}>
                          {coupon.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs ${coupon.textColor} opacity-75`}
                          >
                            Valid till {coupon.validUntil}
                          </span>
                          {subtotal >= coupon.minOrder ? (
                            <Button
                              size="sm"
                              onClick={() => applyCoupon(coupon.code)}
                              className="bg-white text-orange-600 hover:bg-gray-50 text-xs px-3 py-1 h-6"
                              disabled={appliedPromo === coupon.code}
                            >
                              {appliedPromo === coupon.code
                                ? "Applied"
                                : "Apply"}
                            </Button>
                          ) : (
                            <span
                              className={`text-xs ${coupon.textColor} opacity-75`}
                            >
                              Add ₹{coupon.minOrder - subtotal} more
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  {/* Promo Code Input */}
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={applyPromoCode}
                        variant="outline"
                        className="text-orange-600 border-orange-300 bg-transparent"
                      >
                        Apply
                      </Button>
                    </div>
                    {appliedPromo && (
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Promo code {appliedPromo} applied!
                      </p>
                    )}
                  </div>

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
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo Discount</span>
                        <span className="font-semibold">-₹{promoDiscount}</span>
                      </div>
                    )}
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

                  <Link href="/checkout">
                    <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mb-4">
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-xl font-semibold bg-transparent"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        icon: Shield,
                        text: "100% Secure payments",
                        color: "text-green-600",
                      },
                      {
                        icon: RotateCcw,
                        text: "Easy returns & exchanges",
                        color: "text-blue-600",
                      },
                      {
                        icon: Clock,
                        text: "24/7 Customer support",
                        color: "text-purple-600",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span className="text-sm text-gray-700">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Limited Time Offer Section */}
      {/* <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-orange-600 mb-4">
              Don't Miss Out!
            </h2>
            <p className="text-gray-700 text-lg">
              Grab these limited-time offers before they're gone.
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-6 w-max px-2">
              {offerProducts.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm w-64 min-w-[16rem] p-4 flex-shrink-0 hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <Image
                      src={offer.image || "/placeholder.svg"}
                      alt={offer.name}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold">
                      {offer.discount}% OFF
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                      {offer.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {offer.category}
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {offer.rating}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-lg text-orange-600">
                          ₹{offer.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{offer.originalPrice}
                        </span>
                      </div>
                      <Button
                        onClick={() => addOfferToCart(offer)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      <Footer />
    </div>
  );
}
