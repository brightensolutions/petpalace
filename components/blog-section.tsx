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
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p>Loading blogs...</p>
        </div>
      </section>
    );
  }

  const featuredBlogs = blogs.filter((blog) => blog.active).slice(0, 1); // take only 1 featured
  const otherBlogs = blogs.filter((blog) => blog.active).slice(1, 4); // next 3

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
            {featuredBlogs.map((post) => (
              <Card
                key={post._id}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
              >
                <div className="relative">
                  <Image
                    src={post.thumbnail || "/placeholder.svg"}
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
            {otherBlogs.map((post) => (
              <Card
                key={post._id}
                className="group hover:shadow-md transition-all duration-300 border-0 bg-white overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex gap-3">
                    <div className="relative overflow-hidden flex-shrink-0">
                      <Image
                        src={post.thumbnail || "/placeholder.svg"}
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
