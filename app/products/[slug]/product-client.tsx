"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  brand: string;
  name: string;
  rating: number;
  reviews: number;
  images: string[];
  packs: Pack[];
  offers: Offer[];
  features: Feature[];
  customerReviews: CustomerReview[];
}

interface RelatedProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: string;
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
  const [selectedPack, setSelectedPack] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  const currentPack = product.packs[selectedPack];
  const visibleThumbnails = 4;
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

  const handleAddToCart = () => {
    console.log("Adding to cart:", {
      product: product.id,
      pack: currentPack.name,
      quantity,
      price: currentPack.salePrice,
    });
    // Add cart logic here
  };

  const handlePincodeCheck = () => {
    if (pincode.trim()) {
      console.log("Checking delivery for pincode:", pincode);
      // Add pincode validation logic here
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

  return (
    <>
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-96 lg:h-[500px] object-contain"
              />

              {/* Navigation Arrows */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md"
                onClick={() =>
                  setSelectedImage(
                    selectedImage > 0
                      ? selectedImage - 1
                      : product.images.length - 1
                  )
                }
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md"
                onClick={() =>
                  setSelectedImage(
                    selectedImage < product.images.length - 1
                      ? selectedImage + 1
                      : 0
                  )
                }
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Thumbnail Carousel */}
            <div className="relative">
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8 rounded-full"
                  onClick={prevThumbnails}
                  disabled={thumbnailStartIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {/* Thumbnails */}
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
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
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

                {/* Next Button */}
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

          {/* Product Details */}
          <div className="space-y-6">
            {/* Rating and Wishlist */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <Link href="#reviews" className="text-blue-600 hover:underline">
                  {product.reviews} Reviews
                </Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-500"
              >
                <Heart className="w-6 h-6" />
              </Button>
            </div>

            {/* Brand and Title */}
            <div>
              <Link
                href={`/brands/${product.brand
                  .toLowerCase()
                  .replace(" ", "-")}`}
                className="text-orange-600 font-semibold hover:underline"
              >
                {product.brand}
              </Link>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
                {product.name}
              </h1>
            </div>

            {/* Pack Options */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📦</span> Pack Options
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {product.packs.map((pack, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPack(index)}
                    className={`relative p-3 rounded-xl border-2 text-left transition-colors ${
                      selectedPack === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{pack.name}</div>
                    <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
                      {pack.discount}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Offers */}
            <div className="space-y-3">
              {product.offers.map((offer, index) => (
                <div key={index} className={`p-3 rounded-lg ${offer.bgColor}`}>
                  <div className={`font-medium ${offer.textColor}`}>
                    {offer.title}. Use Code:{" "}
                    <span className="font-bold">{offer.code}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{currentPack.salePrice}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ₹{currentPack.originalPrice}
                </span>
                <Badge className="bg-red-100 text-red-600">
                  (
                  {Math.round(
                    ((currentPack.originalPrice - currentPack.salePrice) /
                      currentPack.originalPrice) *
                      100
                  )}
                  % Off)
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                MRP: ₹{currentPack.originalPrice} incl. of all taxes
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                ADD TO CART
              </Button>
            </div>

            {/* Delivery Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Delivery & Service Information
                </h3>

                {/* Pincode Checker */}
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter Pincode To Check Delivery"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handlePincodeCheck}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                  >
                    Check
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {product.features.map((feature, index) => {
                    const IconComponent = getIconComponent(feature.icon);
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">{feature.text}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="py-16" id="reviews">
        <div className="container mx-auto px-4">
          {/* Reviews Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(product.rating))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {product.rating}
                  </span>
                  <span className="text-gray-600">out of 5</span>
                </div>
                <span className="text-gray-600">
                  Based on {product.reviews} reviews
                </span>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Write a Review
            </Button>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {product.customerReviews.map((review) => (
              <Card key={review.id} className="border-0 shadow-sm h-fit">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {review.name}
                        </h4>
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
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
                    <h5 className="font-semibold text-gray-900 mb-2 text-sm">
                      {review.title}
                    </h5>
                    <p className="text-gray-700 text-sm leading-relaxed">
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

          {/* Load More Reviews */}
          <div className="text-center">
            <Button variant="outline" className="px-8 py-3">
              Load More Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* Handpicked for You */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Handpicked for you
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="group hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-contain bg-white rounded-t-xl"
                    />
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                      {relatedProduct.discount}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{relatedProduct.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{relatedProduct.originalPrice}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
