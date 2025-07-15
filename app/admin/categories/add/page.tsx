"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // ✅ Toast import

interface Category {
  _id: string;
  name: string;
  parentId: string | null;
}

export default function AddCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const json = await res.json();
        if (json.success) {
          setCategories(json.data);
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch (err) {
        toast.error("Something went wrong while fetching categories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setSlug(slugify(name, { lower: true }));
  }, [name]);

  const buildSelectOptions = (
    cats: Category[],
    parent: string | null = null,
    prefix = ""
  ): { label: string; value: string }[] => {
    return cats
      .filter((c) => c.parentId === parent)
      .flatMap((cat) => {
        const label = prefix + cat.name;
        const children = buildSelectOptions(cats, cat._id, label + " > ");
        return [{ label, value: cat._id }, ...children];
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    if (parentId) formData.append("parentId", parentId);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Category successfully added!");
        router.push("/admin/categories");
      } else {
        toast.error("Error adding category");
      }
    } catch (err) {
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="w-full p-6 md:p-10">
      <Link
        href="/admin/categories"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to All Categories
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        Add New Category
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            placeholder="e.g. Dog Food"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug (auto-generated)</Label>
          <Input id="slug" value={slug} disabled />
        </div>

        <div>
          <Label htmlFor="parentId">Parent Category</Label>
          <select
            id="parentId"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          >
            <option value="">None (Main Category)</option>
            {buildSelectOptions(categories).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="image">Upload Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImage(file);
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
          {preview && (
            <Image
              src={preview}
              alt="Preview"
              width={100}
              height={100}
              className="mt-3 rounded border"
            />
          )}
        </div>

        <Button
          type="submit"
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          Add Category
        </Button>
      </form>
    </div>
  );
}
