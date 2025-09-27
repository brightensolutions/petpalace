"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"basic" | "seo">("basic");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [active, setActive] = useState(true);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // SEO
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch blog");

        const data = await res.json();
        const blog = data.data;

        setTitle(blog.title);
        setContent(blog.content);
        setCategory(blog.category);
        setAuthor(blog.author);
        setActive(blog.active);
        setMetaTitle(blog.metaTitle || "");
        setMetaDescription(blog.metaDescription || "");
        setSlug(blog.slug);
        setPreview(blog.thumbnail || null);
      } catch (err) {
        toast.error("Error loading blog details");
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("author", author);
    formData.append("active", String(active));
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("slug", slug);

    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        toast.success("Blog updated successfully!");
        router.push("/admin/blogs");
      } else {
        toast.error("Failed to update blog.");
      }
    } catch {
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="w-full p-6 md:p-10">
      <Link
        href="/admin/blogs"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to All Blogs
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-orange-600">Edit Blog</h1>

      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-300">
        <button
          type="button"
          className={`px-4 py-2 -mb-px font-medium ${
            activeTab === "basic"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("basic")}
        >
          Basic Details
        </button>
        <button
          type="button"
          className={`px-4 py-2 -mb-px font-medium ${
            activeTab === "seo"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("seo")}
        >
          SEO Details
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === "basic" && (
          <div className="space-y-4 border p-4 rounded-lg bg-white shadow-sm">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="thumbnail">Upload Thumbnail</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setThumbnail(file);
                  setPreview(file ? URL.createObjectURL(file) : preview);
                }}
              />
              {preview && (
                <Image
                  src={preview}
                  alt="Preview"
                  width={300}
                  height={150}
                  className="mt-3 rounded border"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={active}
                onCheckedChange={(val) => setActive(val)}
              />
              <Label>Active</Label>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-4 border p-4 rounded-lg bg-white shadow-sm">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                rows={4}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          Update Blog
        </Button>
      </form>
    </div>
  );
}
