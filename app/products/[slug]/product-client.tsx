"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Star,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  User,
  ThumbsUp,
  ThumbsDown,
  Truck,
  RotateCcw,
  Shield,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useWishlist } from "@/hooks/use-wishlist";
import { useRouter } from "next/navigation";
import {
  addToCart as addToCartService,
  getCartItemCount,
} from "@/lib/services/cart-service";

interface Pack {
  name: string;
  discount: string;
  originalPrice: number;
  salePrice: number;
}

interface Offer {
  title: string;
  code: string;
  bgColor: string;
  textColor: string;
}

interface Feature {
  icon: string;
  text: string;
}

interface CustomerReview {
  id: number;
  name: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  rating: number;
  reviews: number;
  images: string[];
  packs: Pack[];
  variantsByType?: { [key: string]: any[] };
  offers: Offer[];
  features: Feature[];
  customerReviews: CustomerReview[];
}

interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  slug: string;
  brand: string;
}

interface ProductClientProps {
  product: Product;
  relatedProducts: RelatedProduct[];
}

export default function ProductClient({
  product,
  relatedProducts,
}: ProductClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantType, setSelectedVariantType] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedPack, setSelectedPack] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    userName: "",
    userEmail: "",
    rating: 5,
    title: "",
    comment: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [userId, setUserId] = useState<string | undefined>(undefined);
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.authenticated === true) {
          setUserId(data.user._id);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (
      product.variantsByType &&
      Object.keys(product.variantsByType).length > 0
    ) {
      setSelectedVariantType(Object.keys(product.variantsByType)[0]);
    }
  }, [product]);

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartItemCount());
    };

    updateCartCount();

    // Listen for cart updates
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const { isInWishlist, toggleWishlist, isLoaded } = useWishlist({
    userId,
  });

  const getAvailablePacks = (): Pack[] => {
    if (
      product.variantsByType &&
      selectedVariantType &&
      product.variantsByType[selectedVariantType]
    ) {
      const currentVariant =
        product.variantsByType[selectedVariantType][selectedVariant];
      if (currentVariant?.packs && currentVariant.packs.length > 0) {
        return currentVariant.packs.map((pack: any) => {
          const originalPrice =
            pack.price || product.packs[0]?.originalPrice || 0;
          const discountPercent = pack.discount_percent || 0;
          const salePrice = originalPrice * (1 - discountPercent / 100);

          return {
            name: pack.label || pack.name,
            discount: `${discountPercent}% off`,
            originalPrice,
            salePrice,
          };
        });
      }
    }
    return product.packs;
  };

  const availablePacks = getAvailablePacks();
  const currentPack = availablePacks[selectedPack] || product.packs[0];

  const visibleThumbnails =
    typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 4;
  const maxThumbnailIndex = Math.max(
    0,
    product.images.length - visibleThumbnails
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const nextThumbnails = () => {
    setThumbnailStartIndex(
      Math.min(maxThumbnailIndex, thumbnailStartIndex + 1)
    );
  };

  const prevThumbnails = () => {
    setThumbnailStartIndex(Math.max(0, thumbnailStartIndex - 1));
  };

  const handleVariantChange = (index: number) => {
    setSelectedVariant(index);
    setSelectedPack(0);
  };

  const handleAddToCart = async () => {
    try {
      const cartItem = {
        productId: product.id,
        variantId:
          selectedVariantType &&
          product.variantsByType?.[selectedVariantType]?.[selectedVariant]?._id,
        packId: undefined, // Add pack ID if needed
        quantity,
        price: currentPack.salePrice,
        name: product.name,
        image: product.images[0],
        brand: product.brand,
        variantLabel: currentPack.name,
        sku: undefined, // Add SKU if available
        foodType: undefined, // Add food type if available
      };

      await addToCartService(cartItem);

      toast.success("Added to Cart", {
        description: `${product.name} (${currentPack.name}) has been added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error", {
        description: "Failed to add item to cart. Please try again.",
      });
    }
  };

  const handlePincodeCheck = () => {
    if (pincode.trim()) {
      console.log("Checking delivery for pincode:", pincode);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap = {
      truck: Truck,
      "rotate-ccw": RotateCcw,
      shield: Shield,
    };
    return iconMap[iconName as keyof typeof iconMap] || Truck;
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          userName: reviewForm.userName,
          userEmail: reviewForm.userEmail,
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Review Submitted!", {
          description: "Your review will be visible after admin approval.",
        });
        setShowReviewForm(false);
        setReviewForm({
          userName: "",
          userEmail: "",
          rating: 5,
          title: "",
          comment: "",
        });
      } else {
        toast.error("Error", {
          description: data.error || "Failed to submit review",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderStarRating = (
    currentRating: number,
    onRatingChange?: (rating: number) => void
  ) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onRatingChange?.(i + 1)}
        className={`${
          onRatingChange ? "cursor-pointer hover:scale-110" : ""
        } transition-transform`}
        disabled={!onRatingChange}
      >
        <Star
          className={`w-6 h-6 ${
            i < currentRating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      </button>
    ));
  };

  const handleWishlistToggle = async () => {
    if (!userId) {
      toast.error("Login Required", {
        description: "Please login to add items to your wishlist",
        action: {
          label: "Login",
          onClick: () => router.push("/sign-in"),
        },
      });
      return;
    }

    const result = await toggleWishlist(product.id);

    if (result.requiresAuth) {
      toast.error("Login Required", {
        description: "Please login to add items to your wishlist",
        action: {
          label: "Login",
          onClick: () => router.push("/sign-in"),
        },
      });
      return;
    }

    if (result.added) {
      toast.success("Added to Wishlist", {
        description: `${product.name} has been added to your wishlist`,
      });
    } else {
      toast.info("Removed from Wishlist", {
        description: `${product.name} has been removed from your wishlist`,
      });
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          <div className="space-y-4">
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-64 sm:h-80 lg:h-[500px] object-contain"
              />

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md h-8 w-8 sm:h-10 sm:w-10"
                onClick={() =>
                  setSelectedImage(
                    selectedImage > 0
                      ? selectedImage - 1
                      : product.images.length - 1
                  )
                }
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md h-8 w-8 sm:h-10 sm:w-10"
                onClick={() =>
                  setSelectedImage(
                    selectedImage < product.images.length - 1
                      ? selectedImage + 1
                      : 0
                  )
                }
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8 rounded-full"
                  onClick={prevThumbnails}
                  disabled={thumbnailStartIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex gap-2 overflow-hidden">
                  {product.images
                    .slice(
                      thumbnailStartIndex,
                      thumbnailStartIndex + visibleThumbnails
                    )
                    .map((image, index) => {
                      const actualIndex = thumbnailStartIndex + index;
                      return (
                        <button
                          key={actualIndex}
                          onClick={() => setSelectedImage(actualIndex)}
                          className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImage === actualIndex
                              ? "border-blue-500"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Product view ${actualIndex + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain bg-gray-50"
                          />
                        </button>
                      );
                    })}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8 rounded-full"
                  onClick={nextThumbnails}
                  disabled={thumbnailStartIndex >= maxThumbnailIndex}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-sm sm:text-base">
                    {product.rating}
                  </span>
                </div>
                <Link
                  href="#reviews"
                  className="text-blue-600 hover:underline text-sm sm:text-base"
                >
                  {product.reviews} Reviews
                </Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={`transition-colors flex-shrink-0 ${
                  isLoaded && isInWishlist(product.id)
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400 hover:text-red-500"
                }`}
                onClick={handleWishlistToggle}
                disabled={!isLoaded}
              >
                <Heart
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${
                    isLoaded && isInWishlist(product.id) ? "fill-current" : ""
                  }`}
                />
              </Button>
            </div>

            <div>
              <Link
                href={`/brands/${product.brand
                  .toLowerCase()
                  .replace(" ", "-")}`}
                className="text-orange-600 font-semibold hover:underline text-sm sm:text-base"
              >
                {product.brand}
              </Link>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
                {product.name}
              </h1>
            </div>

            {product.variantsByType &&
              Object.keys(product.variantsByType).length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <span>
                      {selectedVariantType === "weight" ? "⚖️" : "📏"}
                    </span>{" "}
                    {selectedVariantType === "weight" ? "Weight" : "Size"}{" "}
                    Options
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {product.variantsByType[selectedVariantType]?.map(
                      (variant: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleVariantChange(index)}
                          className={`relative p-2 sm:p-3 rounded-xl border-2 text-left transition-colors ${
                            selectedVariant === index
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-medium text-gray-900 text-sm sm:text-base">
                            {variant.label}
                          </div>
                          {variant.stock > 0 ? (
                            <div className="text-xs text-green-600 mt-1">
                              In Stock
                            </div>
                          ) : (
                            <div className="text-xs text-red-600 mt-1">
                              Out of Stock
                            </div>
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <span>📦</span> Pack Options
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {availablePacks.map((pack, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPack(index)}
                    className={`relative p-2 sm:p-3 rounded-xl border-2 text-left transition-colors ${
                      selectedPack === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm sm:text-base">
                      {pack.name}
                    </div>
                    <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
                      {pack.discount}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <span>🎁</span> Offers
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {product.offers.map((offer, index) => (
                  <div
                    key={index}
                    className={`p-2 sm:p-3 rounded-lg ${offer.bgColor}`}
                  >
                    <div
                      className={`font-medium text-xs sm:text-sm ${offer.textColor}`}
                    >
                      {offer.title}. Use Code:{" "}
                      <span className="font-bold">{offer.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ₹{currentPack.salePrice}
                </span>
                <span className="text-base sm:text-lg text-gray-500 line-through">
                  ₹{currentPack.originalPrice}
                </span>
                <Badge className="bg-red-100 text-red-600 text-xs sm:text-sm">
                  (
                  {Math.round(
                    ((currentPack.originalPrice - currentPack.salePrice) /
                      currentPack.originalPrice) *
                      100
                  )}
                  % Off)
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                MRP: ₹{currentPack.originalPrice} incl. of all taxes
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-medium text-sm sm:text-base">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <span className="px-3 sm:px-4 py-2 font-medium text-sm sm:text-base">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                ADD TO CART
              </Button>
            </div>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">
                  Delivery & Service Information
                </h3>

                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 text-sm sm:text-base"
                  />
                  <Button
                    onClick={handlePincodeCheck}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 text-sm sm:text-base"
                  >
                    Check
                  </Button>
                </div>

                <div className="space-y-3">
                  {product.features.map((feature, index) => {
                    const IconComponent = getIconComponent(feature.icon);
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                        <span className="text-gray-700 text-xs sm:text-sm">
                          {feature.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <section className="py-8 sm:py-16" id="reviews">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Customer Reviews
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(product.rating))}
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {product.rating}
                  </span>
                  <span className="text-sm sm:text-base text-gray-600">
                    out of 5
                  </span>
                </div>
                <span className="text-sm sm:text-base text-gray-600">
                  Based on {product.reviews} reviews
                </span>
              </div>
            </div>
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto text-sm sm:text-base"
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </Button>
          </div>

          {showReviewForm && (
            <Card className="mb-8 border-2 border-blue-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Write Your Review
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowReviewForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form
                  onSubmit={handleReviewSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <div>
                    <Label className="text-sm sm:text-base font-semibold mb-2 block">
                      Your Rating <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-1">
                      {renderStarRating(reviewForm.rating, (rating) =>
                        setReviewForm({ ...reviewForm, rating })
                      )}
                      <span className="ml-2 text-sm sm:text-base text-gray-600">
                        ({reviewForm.rating} out of 5)
                      </span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="userName"
                        className="text-sm sm:text-base font-semibold mb-2 block"
                      >
                        Your Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="userName"
                        type="text"
                        placeholder="Enter your name"
                        value={reviewForm.userName}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            userName: e.target.value,
                          })
                        }
                        required
                        className="w-full text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="userEmail"
                        className="text-sm sm:text-base font-semibold mb-2 block"
                      >
                        Your Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="userEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={reviewForm.userEmail}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            userEmail: e.target.value,
                          })
                        }
                        required
                        className="w-full text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="reviewTitle"
                      className="text-sm sm:text-base font-semibold mb-2 block"
                    >
                      Review Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reviewTitle"
                      type="text"
                      placeholder="Give your review a title"
                      value={reviewForm.title}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, title: e.target.value })
                      }
                      required
                      maxLength={100}
                      className="w-full text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="reviewComment"
                      className="text-sm sm:text-base font-semibold mb-2 block"
                    >
                      Your Review <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="reviewComment"
                      placeholder="Share your experience with this product..."
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          comment: e.target.value,
                        })
                      }
                      required
                      maxLength={1000}
                      rows={5}
                      className="w-full resize-none text-sm sm:text-base"
                    />
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {reviewForm.comment.length}/1000 characters
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto text-sm sm:text-base"
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Your review will be published after admin approval
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {product.customerReviews.map((review) => (
              <Card key={review.id} className="border-0 shadow-sm h-fit">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                          {review.name}
                        </h4>
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs flex-shrink-0">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2 text-xs sm:text-sm">
                      {review.title}
                    </h5>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Was this helpful?</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-green-600 h-6 px-2"
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {review.helpful}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-red-600 h-6 px-2"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="px-6 sm:px-8 py-2 sm:py-3 bg-transparent text-sm sm:text-base"
            >
              Load More Reviews
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-8 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            Handpicked for you
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.slug}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-shadow duration-300 border-0">
                  <CardContent className="p-0">
                    <div className="relative bg-white rounded-t-xl overflow-hidden">
                      <Image
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        width={200}
                        height={200}
                        className="w-full h-32 sm:h-40 lg:h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 sm:p-4 space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {relatedProduct.brand}
                      </p>
                      <h3 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[2.5rem]">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          ₹{relatedProduct.price}
                        </span>
                        {relatedProduct.originalPrice >
                          relatedProduct.price && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            ₹{relatedProduct.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
