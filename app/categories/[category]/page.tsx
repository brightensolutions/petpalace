import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Star, Grid3X3, List, ChevronDown, Heart, ShoppingCart, Search, SlidersHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// This is a dynamic category page that will handle all categories
// Category data will be fetched from database based on params.category
// Examples: /categories/cat-food, /categories/dog-toys, /categories/bird-supplies

// Future: Generate metadata dynamically
// export async function generateMetadata({ params }: { params: { category: string } }) {
//   const categoryData = await fetchCategoryData(params.category)
//   return {
//     title: `${categoryData.name} | Pet Palace`,
//     description: categoryData.description,
//   }
// }

export default function CategoryPage({ params }: { params: { category: string } }) {
  const filterTabs = [
    "Brand",
    "Shop For",
    "Life Stage",
    "Breed Size",
    "Product Type",
    "Special Diet",
    "Protein Source",
    "Price Range",
  ]

  const categories = [
    { name: "All Cat Food", icon: "🐱", count: 245 },
    { name: "Dry Food", icon: "🥘", count: 156 },
    { name: "Wet Food", icon: "🥫", count: 89 },
    { name: "Grain Free Food", icon: "🌾", count: 67 },
    { name: "Kitten Food", icon: "🐾", count: 45 },
    { name: "Veterinary Food", icon: "💊", count: 23 },
    { name: "Supplements", icon: "💊", count: 34 },
  ]

  const products = [
    {
      id: 1,
      name: "Royal Canin Ultra Light Wet Cat Food - 85g packs",
      brand: "Royal Canin",
      image: "/placeholder.svg?height=300&width=300&text=Royal+Canin+Cat+Food",
      rating: 5.0,
      reviews: 124,
      originalPrice: 120.52,
      discountedPrice: 100.52,
      discount: "Extra 3% OFF",
      sizes: ["Pack Of 1", "Pack Of 4", "Pack Of 8"],
      badges: ["12%", "15%", "18%"],
    },
    {
      id: 2,
      name: "Royal Canin Fit 32 Adult Dry Cat Food",
      brand: "Royal Canin",
      image: "/placeholder.svg?height=300&width=300&text=Royal+Canin+Dry+Food",
      rating: 4.9,
      reviews: 89,
      originalPrice: 452,
      discountedPrice: 352,
      discount: "Extra 3% OFF",
      sizes: ["400g", "1kg", "2kg", "4kg"],
      badges: ["10%", "12%", "15%", "18%"],
    },
    {
      id: 3,
      name: "Farmina N&D Chicken & Pomegranate Grain Free Adult Cat Food",
      brand: "Farmina",
      image: "/placeholder.svg?height=300&width=300&text=Farmina+Cat+Food",
      rating: 4.89,
      reviews: 156,
      originalPrice: 907.55,
      discountedPrice: 707.55,
      discount: "Extra 5% Off upto ₹400",
      sizes: ["300g", "1.5kg", "5kg"],
      badges: ["11%", "13%", "16%"],
    },
    {
      id: 4,
      name: "Meowsi by HUFT Tuna & Chicken Pate Canned Cat Wet Food - 80g",
      brand: "Meowsi",
      image: "/placeholder.svg?height=300&width=300&text=Meowsi+Wet+Food",
      rating: 4.7,
      reviews: 67,
      originalPrice: 180,
      discountedPrice: 160,
      discount: "Extra 3% OFF",
      sizes: ["Pack Of 1", "Pack Of 6", "Pack Of 12"],
      badges: ["5%", "8%", "12%"],
    },
    {
      id: 5,
      name: "Whiskas Adult Dry Cat Food - Ocean Fish Flavour",
      brand: "Whiskas",
      image: "/placeholder.svg?height=300&width=300&text=Whiskas+Cat+Food",
      rating: 4.5,
      reviews: 234,
      originalPrice: 299,
      discountedPrice: 249,
      discount: "Extra 3% OFF",
      sizes: ["480g", "1.2kg", "3kg"],
      badges: ["8%", "12%", "15%"],
    },
    {
      id: 6,
      name: "Purina Pro Plan Adult Cat Food - Chicken & Rice",
      brand: "Purina Pro Plan",
      image: "/placeholder.svg?height=300&width=300&text=Purina+Cat+Food",
      rating: 4.8,
      reviews: 178,
      originalPrice: 650,
      discountedPrice: 550,
      discount: "Extra 5% Off upto ₹400",
      sizes: ["400g", "1kg", "2.5kg"],
      badges: ["10%", "15%", "18%"],
    },
  ]

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
            <span className="text-gray-900 font-medium capitalize">{params.category.replace("-", " ")}</span>
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-400 to-orange-500 py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">Premium Pet Products</h1>
              <p className="text-2xl text-orange-100 mb-8">Quality products for your beloved pets!</p>
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl">
                Shop Now
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Cat+Food+Products+with+Cat"
                alt="Cat food products with cat"
                width={600}
                height={400}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-4 overflow-x-auto">
            <h2 className="text-2xl font-bold text-gray-900 mr-6 whitespace-nowrap capitalize">
              {params.category.replace("-", " ")}
            </h2>
            {filterTabs.map((tab, index) => (
              <Button
                key={index}
                variant="outline"
                className="whitespace-nowrap rounded-full border-gray-300 hover:border-blue-500 hover:text-blue-600"
              >
                {tab}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                </div>

                {/* Search Filter */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search products..." className="pl-10 rounded-xl" />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({category.count})</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Range */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">Price Range</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Min" className="rounded-xl" />
                    <Input placeholder="Max" className="rounded-xl" />
                  </div>
                  <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 rounded-xl">Apply</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort and View Options */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">Showing {products.length} of 245 products</p>
              <div className="flex items-center gap-4">
                <select className="border border-gray-300 rounded-xl px-4 py-2 text-sm">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Customer Rating</option>
                  <option>Newest First</option>
                </select>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative overflow-hidden rounded-t-xl">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Discount Badge */}
                      <Badge className="absolute top-3 left-3 bg-green-500 text-white font-bold">
                        {product.discount}
                      </Badge>
                      {/* Wishlist Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Brand */}
                      <p className="text-sm text-blue-600 font-medium mb-1">{product.brand}</p>

                      {/* Product Name */}
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                      </div>

                      {/* Size Options */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.sizes.slice(0, 3).map((size, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs rounded-lg border-gray-300 hover:border-blue-500 hover:text-blue-600"
                          >
                            {size}
                          </Button>
                        ))}
                        {product.sizes.length > 3 && (
                          <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                            +{product.sizes.length - 3} more
                          </Button>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-gray-900">₹{product.discountedPrice}</span>
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        <Badge className="bg-red-100 text-red-600 text-xs">
                          {Math.round(
                            ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100,
                          )}
                          % OFF
                        </Badge>
                      </div>

                      {/* Add to Cart Button */}
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="px-8 py-3 rounded-xl border-gray-300 hover:border-blue-500 hover:text-blue-600"
              >
                Load More Products
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
