"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";

export function BlogSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");

        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        toast.error("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border-0 shadow-md">
                <div className="w-full h-64 bg-gray-200 animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="flex gap-3">
                      <div className="w-20 h-16 sm:w-24 sm:h-20 bg-gray-200 animate-pulse rounded-l-lg" />
                      <div className="flex-1 p-3">
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
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

  const featuredBlogs = blogs.filter((blog) => blog.active).slice(0, 1);
  const otherBlogs = blogs.filter((blog) => blog.active).slice(1, 4);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Latest from Our Blog
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Stay updated with tips and guides for your beloved pets
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Post */}
          <div className="lg:col-span-2">
            {featuredBlogs.map((post) => (
              <Card
                key={post._id}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
              >
                <div className="relative w-full h-64 sm:h-56 md:h-64 lg:h-64">
                  <Image
                    src={post.thumbnail || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 hover:text-orange-600 transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 mt-2 hidden sm:block line-clamp-3 text-sm sm:text-base">
                    {post.description || "Read more about this topic..."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Other Articles */}
          <div className="space-y-4">
            {otherBlogs.map((post) => (
              <Card
                key={post._id}
                className="group hover:shadow-md transition-all duration-300 border-0 bg-white overflow-hidden rounded-lg"
              >
                <CardContent className="p-0">
                  <div className="flex gap-2 sm:gap-3 md:gap-4">
                    <div className="relative overflow-hidden flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-20 rounded-l-lg">
                      <Image
                        src={post.thumbnail || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-l-lg"
                      />
                    </div>
                    <div className="flex-1 p-2 sm:p-3">
                      <h4 className="text-sm sm:text-base md:text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h4>
                      <p className="hidden sm:block text-gray-600 text-xs sm:text-sm md:text-sm line-clamp-2 mt-1">
                        {post.description || "Click to read more..."}
                      </p>
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
