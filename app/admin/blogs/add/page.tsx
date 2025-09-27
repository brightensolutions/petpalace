"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

// dynamic import Editor
const Editor = dynamic(() => import("@/components/ui/editor"), { ssr: false });

export default function AddBlogPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"basic" | "seo">("basic");

  // Basic
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [active, setActive] = useState(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState(""); // state for category

  // SEO
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required.");
    if (!content.replace(/<[^>]*>/g, "").trim())
      return toast.error("Content is required.");
    if (!slug.trim()) return toast.error("Slug is required.");
    if (!category.trim()) return toast.error("Category is required.");
    if (!thumbnail) return toast.error("Image (thumbnail) is required.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    formData.append("active", String(active));
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("slug", slug);
    formData.append("category", category); // append category
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
      formData.append("image", thumbnail); // append 'image' alias for stricter APIs
    }

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success("Blog added successfully!");
        router.push("/admin/blogs");
      } else {
        toast.error(data?.message || "Failed to add blog.");
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

      <h1 className="text-3xl font-bold mb-6 text-orange-600">Add Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "basic" | "seo")}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Basic */}
          <TabsContent value="basic" className="space-y-6 mt-4">
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
              <Label>Content</Label>
              <Editor
                content={content}
                onChange={setContent}
                placeholder="Write your blog content..."
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={active}
                onCheckedChange={(val) => setActive(val)}
              />
              <Label>Active</Label>
            </div>
            <div>
              <Label htmlFor="thumbnail">Upload Thumbnail</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                required
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setThumbnail(file);
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
              {preview && (
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  width={300}
                  height={150}
                  className="mt-3 rounded border"
                />
              )}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Tech"
                required
              />
            </div>{" "}
            {/* add Category field */}
            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                onClick={() => setTab("seo")}
                className="bg-gray-800 text-white hover:bg-black"
              >
                Next
              </Button>
            </div>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="space-y-6 mt-4">
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
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                Add Blog
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
