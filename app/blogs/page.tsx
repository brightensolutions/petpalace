import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import dbConnect from "@/lib/db/db";
import Blog from "@/lib/models/Blog";

export const metadata: Metadata = {
  title: "Blog - Pet Palace",
  description: "Read the latest tips, guides, and stories about pet care",
};

async function getBlogs() {
  try {
    await dbConnect();
    const blogs = await Blog.find({ active: true })
      .sort({ createdAt: -1 })
      .lean();
    return blogs.map((blog) => ({
      ...blog,
      _id: blog._id.toString(),
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
                Pet Care Blog
              </h1>
              <p className="text-lg sm:text-xl text-orange-100">
                Expert tips, guides, and stories to help you care for your
                beloved pets
              </p>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            {blogs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  No blog posts available yet.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog: any) => (
                  <Link key={blog._id} href={`/blogs/${blog.slug}`}>
                    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                      <div className="relative w-full h-56 overflow-hidden">
                        <Image
                          src={
                            blog.thumbnail ||
                            "/placeholder.svg?height=400&width=600&text=Blog"
                          }
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {blog.category && (
                          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {blog.category}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-3 line-clamp-2">
                          {blog.title}
                        </h2>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          {blog.author && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{blog.author}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(blog.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 line-clamp-3 mb-4">
                          {blog.metaDescription || "Click to read more..."}
                        </p>

                        <div className="flex items-center text-orange-600 font-semibold group-hover:gap-2 transition-all">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
