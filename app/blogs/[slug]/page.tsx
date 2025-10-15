import type { Metadata } from "next";
import BlogDetailPageClient from "./BlogDetailPageClient";
import dbConnect from "@/lib/db/db";
import Blog from "@/lib/models/Blog";

async function getBlog(slug: string) {
  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug, active: true }).lean();
    if (!blog) return null;

    return {
      ...blog,
      _id: blog._id.toString(),
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt?.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.title,
    keywords: blog.metaKeywords,
  };
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getBlog(params.slug);
  return <BlogDetailPageClient blog={blog} />;
}
