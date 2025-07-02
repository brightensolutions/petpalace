import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function BlogSection() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Tips for First-Time Dog Owners",
      image: "/placeholder.svg?height=300&width=400&text=Dog+Training+Tips",
      featured: true,
    },
    {
      id: 2,
      title: "Understanding Your Cat's Body Language",
      image: "/placeholder.svg?height=200&width=300&text=Cat+Body+Language",
      featured: false,
    },
    {
      id: 3,
      title: "The Ultimate Guide to Pet Nutrition",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Nutrition+Guide",
      featured: false,
    },
    {
      id: 4,
      title: "Creating a Safe Home Environment",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Safe+Home",
      featured: false,
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Latest from Our Blog
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Post */}
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
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Other Articles */}
          <div className="space-y-4">
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
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h4>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
