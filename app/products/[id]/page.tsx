"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  Star,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Truck,
  RotateCcw,
  Shield,
  Plus,
  Minus,
  User,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// This is a dynamic product page that will handle all products
// Product data will be fetched from database based on params.id
// Example: /products/royal-canin-ultra-light-wet-cat-food

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedPack, setSelectedPack] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState("")
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0)

  // Mock product data - will come from database in future
  const product = {
    id: params.id,
    brand: "Royal Canin",
    name: "Royal Canin Ultra Light Wet Cat Food - 85 g packs",
    rating: 4.8,
    reviews: 156,
    images: [
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Main+Product",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Back+View",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Ingredients",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Nutrition",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Usage",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Cat+Eating",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Package",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Size+Comparison",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Benefits",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Feeding+Guide",
    ],
    packs: [
      { name: "Pack Of 1", discount: "12% off", originalPrice: 114.0, salePrice: 100.32 },
      { name: "Pack Of 4", discount: "12% off", originalPrice: 456.0, salePrice: 401.28 },
      { name: "Pack Of 8", discount: "12% off", originalPrice: 912.0, salePrice: 802.56 },
      { name: "Pack Of 12", discount: "12% off", originalPrice: 1368.0, salePrice: 1203.84 },
    ],
    offers: [
      {
        title: "Extra 3% OFF on Royal Canin No Minimum Cart Value",
        code: "HUFT3",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
      },
      {
        title: "Extra ₹150 OFF on orders above ₹2999",
        code: "EXT150",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
      },
      {
        title: "Extra ₹150 off on orders above ₹2499",
        code: "SAVE150",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
      },
    ],
    features: [
      { icon: Truck, text: "Enjoy Free Delivery above ₹699" },
      { icon: RotateCcw, text: "No Exchange & Returns" },
      { icon: Shield, text: "100% Authentic Products" },
    ],
    customerReviews: [
      {
        id: 1,
        name: "Priya Sharma",
        rating: 5,
        date: "2024-01-15",
        title: "Excellent quality food for my cat",
        comment:
          "My cat absolutely loves this food! The texture is perfect and she finishes her bowl every time. Great for weight management too.",
        helpful: 12,
        verified: true,
      },
      {
        id: 2,
        name: "Rajesh Kumar",
        rating: 4,
        date: "2024-01-10",
        title: "Good product but expensive",
        comment:
          "Quality is good and my cat likes it. However, it's quite expensive compared to other brands. The packaging is excellent.",
        helpful: 8,
        verified: true,
      },
      {
        id: 3,
        name: "Anita Patel",
        rating: 5,
        date: "2024-01-05",
        title: "Perfect for senior cats",
        comment:
          "My 12-year-old cat has been eating this for months now. It's easy to digest and she maintains a healthy weight.",
        helpful: 15,
        verified: true,
      },
      {
        id: 4,
        name: "Vikram Singh",
        rating: 4,
        date: "2023-12-28",
        title: "Cat loves the taste",
        comment: "Initially my cat was hesitant but now she loves it. Good quality ingredients and proper nutrition.",
        helpful: 6,
        verified: false,
      },
      {
        id: 5,
        name: "Meera Joshi",
        rating: 5,
        date: "2023-12-20",
        title: "Highly recommended",
        comment: "Best wet food for cats. My vet recommended this and I can see the difference in my cat's health.",
        helpful: 9,
        verified: true,
      },
      {
        id: 6,
        name: "Arjun Reddy",
        rating: 3,
        date: "2023-12-15",
        title: "Average product",
        comment: "It's okay but nothing special. My cat eats it but doesn't seem very excited about it.",
        helpful: 3,
        verified: true,
      },
    ],
  }

  const relatedProducts = [
    {
      id: 1,
      name: "Royal Canin Kitten Wet Food",
      image: "/placeholder.svg?height=200&width=200&text=Kitten+Food",
      price: 89.99,
      originalPrice: 99.99,
      discount: "Get Extra 5% OFF",
    },
    {
      id: 2,
      name: "Royal Canin Adult Cat Food",
      image: "/placeholder.svg?height=200&width=200&text=Adult+Cat+Food",
      price: 159.99,
      originalPrice: 179.99,
      discount: "Get Extra 5% OFF",
    },
    {
      id: 3,
      name: "Royal Canin Senior Cat Food",
      image: "/placeholder.svg?height=200&width=200&text=Senior+Cat+Food",
      price: 199.99,
      originalPrice: 229.99,
      discount: "Get Extra 5% OFF",
    },
  ]

  const currentPack = product.packs[selectedPack]
  const visibleThumbnails = 4
  const maxThumbnailIndex = Math.max(0, product.images.length - visibleThumbnails)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const nextThumbnails = () => {
    setThumbnailStartIndex(Math.min(maxThumbnailIndex, thumbnailStartIndex + 1))
  }

  const prevThumbnails = () => {
    setThumbnailStartIndex(Math.max(0, thumbnailStartIndex - 1))
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50/50 py-2">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

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
                onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md"
                onClick={() => setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0)}
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
                    .slice(thumbnailStartIndex, thumbnailStartIndex + visibleThumbnails)
                    .map((image, index) => {
                      const actualIndex = thumbnailStartIndex + index
                      return (
                        <button
                          key={actualIndex}
                          onClick={() => setSelectedImage(actualIndex)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImage === actualIndex ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
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
                      )
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
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                <Heart className="w-6 h-6" />
              </Button>
            </div>

            {/* Brand and Title */}
            <div>
              <Link
                href={`/brands/${product.brand.toLowerCase().replace(" ", "-")}`}
                className="text-orange-600 font-semibold hover:underline"
              >
                {product.brand}
              </Link>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
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
                      selectedPack === index ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{pack.name}</div>
                    <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">{pack.discount}</Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Offers */}
            <div className="space-y-3">
              {product.offers.map((offer, index) => (
                <div key={index} className={`p-3 rounded-lg ${offer.bgColor}`}>
                  <div className={`font-medium ${offer.textColor}`}>
                    {offer.title}. Use Code: <span className="font-bold">{offer.code}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">₹{currentPack.salePrice}</span>
                <span className="text-lg text-gray-500 line-through">₹{currentPack.originalPrice}</span>
                <Badge className="bg-red-100 text-red-600">
                  ({Math.round(((currentPack.originalPrice - currentPack.salePrice) / currentPack.originalPrice) * 100)}
                  % Off)
                </Badge>
              </div>
              <p className="text-sm text-gray-600">MRP: ₹{currentPack.originalPrice} incl. of all taxes</p>
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
                  <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-xl flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                ADD TO CART
              </Button>
            </div>

            {/* Delivery Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Delivery & Service Information</h3>

                {/* Pincode Checker */}
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter Pincode To Check Delivery"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">Check</Button>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <feature.icon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{feature.text}</span>
                    </div>
                  ))}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">{renderStars(Math.round(product.rating))}</div>
                  <span className="text-2xl font-bold text-gray-900">{product.rating}</span>
                  <span className="text-gray-600">out of 5</span>
                </div>
                <span className="text-gray-600">Based on {product.reviews} reviews</span>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Write a Review</Button>
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
                        <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                        {review.verified && <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
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
                    <h5 className="font-semibold text-gray-900 mb-2 text-sm">{review.title}</h5>
                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Was this helpful?</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600 h-6 px-2">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {review.helpful}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600 h-6 px-2">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Handpicked for you</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-contain bg-white rounded-t-xl"
                    />
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white">{relatedProduct.discount}</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">₹{relatedProduct.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{relatedProduct.originalPrice}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
