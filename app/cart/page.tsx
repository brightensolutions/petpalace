"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
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
  getUserId,
  addToCart,
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
  variantLabel?: string;
  foodType?: "veg" | "non-veg";
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

interface Offer {
  _id: string;
  name: string;
  couponCode: string;
  type: "percentage" | "amount";
  value: number;
  status: string;
  minCartValue?: number;
  maxDiscount?: number;
  expiryDate?: string;
  description?: string;
  buyXGetY?: {
    enabled: boolean;
    getQuantity: number;
    getProducts?: string[];
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [showBuyXGetYModal, setShowBuyXGetYModal] = useState(false);
  const [buyXGetYOffer, setBuyXGetYOffer] = useState<Offer | null>(null);
  const [availableProducts, setAvailableProducts] = useState<OfferProduct[]>(
    []
  );
  const [selectedFreeProducts, setSelectedFreeProducts] = useState<string[]>(
    []
  );
  const [promoProducts, setPromoProducts] = useState<OfferProduct[]>([]);
  const [promoProductsLoading, setPromoProductsLoading] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/users/me");
        const data = await response.json();
        setIsUserAuthenticated(data.authenticated);
        console.log("[v0] Authentication status:", data.authenticated);
      } catch (error) {
        console.error("[v0] Error checking authentication:", error);
        setIsUserAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (isUserAuthenticated) {
          const userId = getUserId();
          console.log("[v0] Loading cart from database for user:", userId);

          const response = await fetch(`/api/cart?userId=${userId}`);
          const data = await response.json();

          if (!data.success || !data.items || data.items.length === 0) {
            // Check if cookies have cart items
            const cookieCart = getCart();
            console.log(
              "[v0] Database cart empty, checking cookies:",
              cookieCart.length,
              "items"
            );

            if (cookieCart.length > 0) {
              // Sync cookie cart to database
              console.log("[v0] Syncing cookie cart to database");
              const syncResponse = await fetch("/api/cart/sync", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ items: cookieCart, userId }),
              });

              if (syncResponse.ok) {
                // Reload cart from database after sync
                const reloadResponse = await fetch(
                  `/api/cart?userId=${userId}`
                );
                const reloadData = await reloadResponse.json();

                if (reloadData.success && reloadData.items) {
                  const mappedItems = reloadData.items.map(
                    (item: any, index: number) => ({
                      id: `${item.productId}-${item.variantId || ""}-${
                        item.packId || ""
                      }-${index}`,
                      name: item.name,
                      price: item.price,
                      originalPrice: undefined,
                      image: item.image || "/placeholder.svg",
                      quantity: item.quantity,
                      category: item.brand || "Product",
                      inStock: true,
                      variantLabel: item.variantLabel,
                      foodType: item.foodType,
                    })
                  );
                  setCartItems(mappedItems);
                  console.log(
                    "[v0] Cart synced and loaded from database:",
                    mappedItems.length,
                    "items"
                  );
                  return;
                }
              }

              // If sync failed, use cookie cart
              const mappedItems = cookieCart.map((item, index) => ({
                id: `${item.productId}-${index}`,
                name: item.name,
                price: item.price,
                originalPrice: undefined,
                image: item.image || "/placeholder.svg",
                quantity: item.quantity,
                category: item.brand || "Product",
                inStock: true,
                variantLabel: item.variantLabel,
                foodType: item.foodType,
              }));
              setCartItems(mappedItems);
              console.log(
                "[v0] Using cookie cart:",
                mappedItems.length,
                "items"
              );
              return;
            }
          }

          if (data.success && data.items) {
            const mappedItems = data.items.map((item: any, index: number) => ({
              id: `${item.productId}-${item.variantId || ""}-${
                item.packId || ""
              }-${index}`,
              name: item.name,
              price: item.price,
              originalPrice: undefined,
              image: item.image || "/placeholder.svg",
              quantity: item.quantity,
              category: item.brand || "Product",
              inStock: true,
              variantLabel: item.variantLabel,
              foodType: item.foodType,
            }));
            setCartItems(mappedItems);
            console.log(
              "[v0] Loaded cart from database:",
              mappedItems.length,
              "items"
            );
          }
        } else {
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
            variantLabel: item.variantLabel,
            foodType: item.foodType,
          }));
          setCartItems(mappedItems);
          console.log(
            "[v0] Loaded cart from cookies:",
            mappedItems.length,
            "items"
          );
        }
      } catch (error) {
        console.error("[v0] Error loading cart:", error);
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
          variantLabel: item.variantLabel,
          foodType: item.foodType,
        }));
        setCartItems(mappedItems);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadCart();
    }

    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, [isUserAuthenticated, authLoading]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/offers");
        const data = await response.json();
        if (data.success) {
          setOffers(data.data);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setOffersLoading(false);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    const fetchPromoProducts = async () => {
      try {
        const response = await fetch("/api/admin/products?limit=4");
        const data = await response.json();
        if (data.success) {
          const mappedProducts: OfferProduct[] = data.data
            .slice(0, 4)
            .map((p: any) => ({
              id: p._id,
              name: p.name,
              price: p.base_price || 0,
              originalPrice: p.mrp || p.base_price || 0,
              image: p.main_image || p.images?.[0] || "/placeholder.svg",
              discount: p.mrp
                ? Math.round(((p.mrp - p.base_price) / p.mrp) * 100)
                : 0,
              rating: 4.5,
              category: p.category?.name || "Product",
            }));
          setPromoProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Error fetching promo products:", error);
      } finally {
        setPromoProductsLoading(false);
      }
    };

    fetchPromoProducts();
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

  const addOfferToCart = async (offer: OfferProduct) => {
    try {
      const cartItem = {
        productId: offer.id,
        quantity: 1,
        price: offer.price,
        name: offer.name,
        image: offer.image,
        brand: offer.category,
      };

      await addToCart(cartItem);

      toast.success(`${offer.name} added to cart!`);

      const updatedCart = getCart();
      const mappedItems = updatedCart.map((item, index) => ({
        id: `${item.productId}-${index}`,
        name: item.name,
        price: item.price,
        originalPrice: undefined,
        image: item.image || "/placeholder.svg",
        quantity: item.quantity,
        category: item.brand || "Product",
        inStock: true,
        variantLabel: item.variantLabel,
        foodType: item.foodType,
      }));
      setCartItems(mappedItems);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    try {
      const response = await fetch("/api/offers/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: promoCode,
          cartValue: subtotal,
          productIds: cartItems.map((item) => item.id),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppliedPromo(data.data.couponCode);
        setPromoDiscount(data.data.discount);
        setAppliedOffer(data.data);

        if (data.data.buyXGetY?.enabled) {
          console.log("[v0] Buy X Get Y offer detected:", data.data.buyXGetY);
          setBuyXGetYOffer(data.data);
          fetchAvailableProducts(data.data);
          setShowBuyXGetYModal(true);
        }

        toast.success(`Coupon ${data.data.couponCode} applied successfully!`);
      } else {
        toast.error(data.message || "Invalid coupon code");
        setAppliedPromo(null);
        setPromoDiscount(0);
        setAppliedOffer(null);
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      toast.error("Failed to apply coupon code");
    }
  };

  const applyCoupon = async (code: string) => {
    setPromoCode(code);

    try {
      const response = await fetch("/api/offers/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: code,
          cartValue: subtotal,
          productIds: cartItems.map((item) => item.id),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppliedPromo(data.data.couponCode);
        setPromoDiscount(data.data.discount);
        setAppliedOffer(data.data);

        if (data.data.buyXGetY?.enabled) {
          console.log("[v0] Buy X Get Y offer detected:", data.data.buyXGetY);
          setBuyXGetYOffer(data.data);
          fetchAvailableProducts(data.data);
          setShowBuyXGetYModal(true);
        }

        toast.success(`Coupon ${data.data.couponCode} applied successfully!`);
      } else {
        toast.error(data.message || "Invalid coupon code");
        setAppliedPromo(null);
        setPromoDiscount(0);
        setAppliedOffer(null);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to apply coupon");
    }
  };

  const fetchAvailableProducts = async (offer: Offer) => {
    try {
      console.log("[v0] Fetching available products for Buy X Get Y offer");
      const response = await fetch("/api/admin/products");
      const data = await response.json();

      if (data.success) {
        const mappedProducts: OfferProduct[] = data.data.map((p: any) => ({
          id: p._id,
          name: p.name,
          price: p.base_price || 0,
          originalPrice: p.mrp || p.base_price || 0,
          image: p.main_image || p.images?.[0] || "/placeholder.svg",
          discount: p.mrp
            ? Math.round(((p.mrp - p.base_price) / p.mrp) * 100)
            : 0,
          rating: 4.5,
          category: p.category?.name || "Product",
        }));

        if (
          offer.buyXGetY?.getProducts &&
          offer.buyXGetY.getProducts.length > 0
        ) {
          const filteredProducts = mappedProducts.filter((p) =>
            offer.buyXGetY!.getProducts!.includes(p.id)
          );
          setAvailableProducts(filteredProducts);
        } else {
          setAvailableProducts(mappedProducts);
        }

        console.log("[v0] Loaded available products:", mappedProducts.length);
      }
    } catch (error) {
      console.error("[v0] Error fetching available products:", error);
    }
  };

  const toggleFreeProduct = (productId: string) => {
    if (selectedFreeProducts.includes(productId)) {
      setSelectedFreeProducts(
        selectedFreeProducts.filter((id) => id !== productId)
      );
    } else {
      if (
        buyXGetYOffer &&
        selectedFreeProducts.length < buyXGetYOffer.buyXGetY!.getQuantity
      ) {
        setSelectedFreeProducts([...selectedFreeProducts, productId]);
      }
    }
  };

  const addFreeProductsToCart = () => {
    console.log("[v0] Adding free products to cart:", selectedFreeProducts);

    const newCartItems = [...cartItems];

    selectedFreeProducts.forEach((productId) => {
      const product = availableProducts.find((p) => p.id === productId);
      if (product) {
        const freeItem: CartItem = {
          id: `free-${product.id}-${Date.now()}`,
          name: `${product.name} (FREE)`,
          price: 0,
          originalPrice: product.price,
          image: product.image,
          quantity: 1,
          category: product.category,
          inStock: true,
        };
        newCartItems.push(freeItem);
      }
    });

    setCartItems(newCartItems);
    setShowBuyXGetYModal(false);
    setSelectedFreeProducts([]);
    toast.success(
      `Added ${selectedFreeProducts.length} free products to cart!`
    );
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
  const total = subtotal + deliveryFee - promoDiscount;

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopping Cart ({cartItems.length} items)
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
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
                            <div className="flex items-center gap-2 mt-1">
                              {item.variantLabel && (
                                <Badge variant="outline" className="text-xs">
                                  {item.variantLabel}
                                </Badge>
                              )}
                              {item.foodType && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    item.foodType === "veg"
                                      ? "border-green-500 text-green-700"
                                      : "border-red-500 text-red-700"
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full mr-1 ${
                                      item.foodType === "veg"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                  />
                                  {item.foodType === "veg" ? "Veg" : "Non-Veg"}
                                </Badge>
                              )}
                            </div>
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

              {!promoProductsLoading && promoProducts.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-orange-600" />
                      ABHI NAHI TO KABHI NAHI
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {promoProducts.slice(0, 4).map((offer) => (
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
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-orange-600" />
                    Available Offers
                  </h2>
                  {offersLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-gray-100 rounded-lg p-3 animate-pulse h-24"
                        ></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {offers.slice(0, 5).map((offer) => {
                        const isEligible =
                          !offer.minCartValue || subtotal >= offer.minCartValue;
                        const bgColor =
                          offer.type === "percentage"
                            ? "bg-gradient-to-r from-orange-100 to-orange-200"
                            : offer.type === "amount"
                            ? "bg-gradient-to-r from-blue-100 to-blue-200"
                            : "bg-gradient-to-r from-green-100 to-green-200";
                        const textColor =
                          offer.type === "percentage"
                            ? "text-orange-800"
                            : offer.type === "amount"
                            ? "text-blue-800"
                            : "text-green-800";

                        return (
                          <div
                            key={offer._id}
                            className={`${bgColor} rounded-lg p-3 border border-gray-200 ${
                              isEligible ? "opacity-100" : "opacity-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Tag className={`w-4 h-4 ${textColor}`} />
                                <span
                                  className={`font-bold text-sm ${textColor}`}
                                >
                                  {offer.couponCode}
                                </span>
                              </div>
                              <Badge
                                className={`${textColor} bg-white/50 text-xs`}
                              >
                                {offer.type === "percentage"
                                  ? `${offer.value}%`
                                  : offer.type === "amount"
                                  ? `₹${offer.value}`
                                  : "Buy X Get Y"}
                              </Badge>
                            </div>
                            <p className={`text-xs ${textColor} mb-2`}>
                              {offer.description || offer.name}
                              {offer.minCartValue &&
                                ` (Min: ₹${offer.minCartValue})`}
                            </p>
                            <div className="flex items-center justify-between">
                              {offer.expiryDate && (
                                <span
                                  className={`text-xs ${textColor} opacity-75`}
                                >
                                  Valid till{" "}
                                  {new Date(
                                    offer.expiryDate
                                  ).toLocaleDateString()}
                                </span>
                              )}
                              {isEligible ? (
                                <Button
                                  size="sm"
                                  onClick={() => applyCoupon(offer.couponCode)}
                                  className="bg-white text-orange-600 hover:bg-gray-50 text-xs px-3 py-1 h-6"
                                  disabled={appliedPromo === offer.couponCode}
                                >
                                  {appliedPromo === offer.couponCode
                                    ? "Applied"
                                    : "Apply"}
                                </Button>
                              ) : (
                                <span
                                  className={`text-xs ${textColor} opacity-75`}
                                >
                                  Add ₹{(offer.minCartValue || 0) - subtotal}{" "}
                                  more
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>

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

                  <Button
                    onClick={() => {
                      if (!isUserAuthenticated) {
                        toast.error("Please login to continue");
                        window.location.href = "/sign-in?redirect=/checkout";
                      } else {
                        window.location.href = "/checkout";
                      }
                    }}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mb-4"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>

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

      {showBuyXGetYModal && buyXGetYOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Select Your Free Products
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Choose {buyXGetYOffer.buyXGetY!.getQuantity} products to get
                    for free!
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBuyXGetYModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProducts.map((product) => {
                  const isSelected = selectedFreeProducts.includes(product.id);
                  const canSelect =
                    isSelected ||
                    selectedFreeProducts.length <
                      buyXGetYOffer.buyXGetY!.getQuantity;

                  return (
                    <div
                      key={product.id}
                      onClick={() => canSelect && toggleFreeProduct(product.id)}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-50"
                          : canSelect
                          ? "border-gray-200 hover:border-orange-300"
                          : "border-gray-200 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="relative">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {product.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-900">
                          FREE
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Selected: {selectedFreeProducts.length} /{" "}
                  {buyXGetYOffer.buyXGetY!.getQuantity}
                </p>
                <Button
                  onClick={addFreeProductsToCart}
                  disabled={
                    selectedFreeProducts.length !==
                    buyXGetYOffer.buyXGetY!.getQuantity
                  }
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
