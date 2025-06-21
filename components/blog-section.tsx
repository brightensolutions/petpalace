import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, User } from "lucide-react"
import Image from "next/image"

export function BlogSection() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Tips for First-Time Dog Owners",
      excerpt:
        "Bringing home your first dog is exciting! Here are the essential tips every new dog parent should know.",
      image: "/placeholder.svg?height=300&width=400&text=Dog+Training+Tips",
      category: "Dog Care",
      author: "Dr. Sarah Johnson",
      date: "2024-01-15",
      readTime: "5 min read",
      featured: true,
    },
    {
      id: 2,
      title: "Understanding Your Cat's Body Language",
      excerpt: "Learn to decode what your feline friend is trying to tell you through their behavior.",
      image: "/placeholder.svg?height=200&width=300&text=Cat+Body+Language",
      category: "Cat Care",
      author: "Emily Rodriguez",
      date: "2024-01-12",
      readTime: "4 min read",
      featured: false,
    },
    {
      id: 3,
      title: "The Ultimate Guide to Pet Nutrition",
      excerpt: "Everything you need to know about feeding your pets the right nutrients.",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Nutrition+Guide",
      category: "Nutrition",
      author: "Mike Chen",
      date: "2024-01-10",
      readTime: "7 min read",
      featured: false,
    },
    {
      id: 4,
      title: "Creating a Safe Home Environment",
      excerpt: "Simple steps to pet-proof your home and create a safe environment.",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Safe+Home",
      category: "Pet Safety",
      author: "David Kumar",
      date: "2024-01-08",
      readTime: "6 min read",
      featured: false,
    },
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Latest from Our Blog</h2>
          <p className="text-lg text-gray-600">Expert tips and insights for your beloved pets</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Post - Takes 2 columns */}
          <div className="lg:col-span-2">
            {blogPosts
              .filter((post) => post.featured)
              .map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
                >
                  <div className="relative">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={600}
                      height={300}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-orange-500 text-white font-semibold">Featured</Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <Badge className="bg-blue-100 text-blue-800 font-medium text-xs">{post.category}</Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{post.author}</span>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm px-4 py-2 flex items-center gap-2">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Thumbnail Posts - Takes 1 column */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">More Articles</h3>
            {blogPosts
              .filter((post) => !post.featured)
              .slice(0, 3)
              .map((post) => (
                <Card
                  key={post.id}
                  className="group hover:shadow-md transition-all duration-300 border-0 bg-white overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex gap-3">
                      <div className="relative overflow-hidden flex-shrink-0">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          width={120}
                          height={80}
                          className="w-20 h-16 object-cover group-hover:scale-105 transition-transform duration-300 rounded-l-lg"
                        />
                      </div>
                      <div className="flex-1 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-gray-100 text-gray-700 text-xs font-medium">{post.category}</Badge>
                          <span className="text-xs text-gray-500">{post.readTime}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{post.author}</span>
                          <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs">
                            Read
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* View All Button */}
            <Button
              variant="outline"
              className="w-full mt-4 border-gray-300 hover:border-blue-500 hover:text-blue-600 text-sm py-2"
            >
              View All Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
