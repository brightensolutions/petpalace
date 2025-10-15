"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";

type Blog = {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  thumbnail?: string;
  category?: string;
  author?: string;
  createdAt: string;
  content: string;
};

type Props = {
  blog: Blog | null;
};

export default function BlogDetailPageClient({ blog }: Props) {
  if (!blog) {
    notFound();
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-4">
            <Link href="/blogs">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blogs
              </Button>
            </Link>
          </div>
        </div>

        {blog.thumbnail && (
          <div className="relative w-full h-[400px] lg:h-[500px]">
            <Image
              src={blog.thumbnail || "/placeholder.svg"}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {blog.category && (
              <div className="absolute top-8 left-8 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {blog.category}
              </div>
            )}
          </div>
        )}

        <article className="container mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
              {blog.author && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">{blog.author}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: blog.title,
                      url: window.location.href,
                    });
                  }
                }}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-orange-600 prose-strong:text-gray-900 prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>

        <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-12 mt-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Want to Read More?
            </h2>
            <p className="text-orange-100 mb-6 text-lg">
              Explore more articles about pet care and wellness
            </p>
            <Link href="/blogs">
              <Button size="lg" variant="secondary" className="gap-2">
                View All Blogs
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
