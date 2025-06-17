import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Truck,
  Shield,
  Headphones,
  Award,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const categories = [
    {
      name: "Dog Food",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/dog-food",
    },
    {
      name: "Cat Food",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/cat-food",
    },
    {
      name: "Treats",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/treats",
    },
    {
      name: "Litter Supplies",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/litter-supplies",
    },
    {
      name: "Prescription Diet",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/prescription-diet",
    },
    {
      name: "Premium Food",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/premium-food",
    },
    {
      name: "Fresh Food",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/fresh-food",
    },
    {
      name: "Supplements",
      image: "/placeholder.svg?height=120&width=120",
      href: "/products/supplements",
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Royal Canin Adult Dog Food",
      price: 2999,
      originalPrice: 3499,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.5,
      reviews: 128,
      badge: "Best Seller",
      discount: "14% OFF",
    },
    {
      id: 2,
      name: "Whiskas Cat Food Variety Pack",
      price: 1899,
      originalPrice: 2299,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.3,
      reviews: 89,
      badge: "New",
      discount: "17% OFF",
    },
    {
      id: 3,
      name: "Pedigree Healthy Treats",
      price: 599,
      originalPrice: 799,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      reviews: 256,
      badge: "Popular",
      discount: "25% OFF",
    },
    {
      id: 4,
      name: "Hill's Science Diet Premium",
      price: 4299,
      originalPrice: 4999,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      reviews: 67,
      badge: "Premium",
      discount: "14% OFF",
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "On orders above ₹999",
    },
    {
      icon: Shield,
      title: "100% Authentic",
      description: "Genuine products only",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Expert pet care advice",
    },
    {
      icon: Award,
      title: "Best Quality",
      description: "Premium pet supplies",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 overflow-hidden">
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="relative z-10 text-center text-white">
            <Badge className="bg-yellow-400 text-black text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold mb-4">
              🎉 Big Pet Sale Event
            </Badge>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-2 sm:mb-4 text-black drop-shadow-lg leading-tight">
              MEGA CLEARANCE
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-4 sm:mb-6 text-black drop-shadow-lg">
              SALE
            </h2>
            <div className="bg-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full inline-block text-sm sm:text-lg font-bold mb-6 sm:mb-8">
              UP TO 70% OFF!
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full w-full sm:w-auto"
                asChild
              >
                <Link href="/products/dogs">Shop Dogs</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-black text-black hover:bg-black hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full bg-white w-full sm:w-auto"
                asChild
              >
                <Link href="/products/cats">Shop Cats</Link>
              </Button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-yellow-400 rounded-full opacity-80"></div>
          <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-pink-400 rounded-full opacity-80"></div>
          <div className="absolute bottom-5 sm:bottom-10 left-10 sm:left-20 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-400 rounded-full opacity-80"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-blue-400 rounded-full opacity-80"></div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 py-3 sm:py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center text-white text-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="bg-white text-orange-600 px-2 sm:px-3 py-1 rounded font-bold text-xs sm:text-sm">
              BANK OFFER
            </div>
            <span className="text-sm sm:text-lg font-semibold">
              Extra 10% OFF on Credit Cards | Orders Above ₹1500
            </span>
            <span className="text-xs sm:text-sm opacity-90">T&C Applied</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-6 sm:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-semibold text-xs sm:text-sm md:text-base">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-black">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-orange-200"
              >
                <div className="mb-3 sm:mb-4 relative overflow-hidden rounded-lg sm:rounded-xl">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={120}
                    height={120}
                    className="w-full h-12 sm:h-16 md:h-20 lg:h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-black text-xs sm:text-sm group-hover:text-orange-500 transition-colors leading-tight">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 space-y-4 sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
              Featured Products
            </h2>
            <Button variant="outline" className="group" asChild>
              <Link href="/products" className="flex items-center space-x-2">
                <span>View All</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md"
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="relative mb-3 sm:mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-36 sm:h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1">
                      {product.badge}
                    </Badge>
                    <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1">
                      {product.discount}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-2 sm:mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 ml-2">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div>
                      <span className="text-base sm:text-lg font-bold text-orange-600">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through ml-2">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-sm sm:text-base py-2 sm:py-3">
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Stay Updated with Pet Palace
          </h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
            Get the latest offers, pet care tips, and product updates
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3 sm:gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-black text-sm sm:text-base"
            />
            <Button className="bg-orange-500 hover:bg-orange-600 px-6 sm:px-8 py-3 text-sm sm:text-base">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
