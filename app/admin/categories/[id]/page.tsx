"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import slugify from "slugify";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image?: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        const json = await res.json();

        if (res.ok && json.success) {
          const cat = json.data;
          setName(cat.name);
          setSlug(cat.slug);
          setParentId(cat.parentId || "");
          setPreview(cat.image || null);
        } else {
          toast.error("Failed to fetch category.");
        }

        const allRes = await fetch("/api/admin/categories");
        const allJson = await allRes.json();
        if (allJson.success) setCategories(allJson.data);
      } catch (err) {
        toast.error("Failed to load data.");
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    setSlug(slugify(name, { lower: true }));
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    if (parentId) formData.append("parentId", parentId);
    if (image) formData.append("image", image);

    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      toast.success("Category updated.");
      router.push("/admin/categories");
    } else {
      toast.error("Update failed.");
    }
  };

  const buildOptions = (
    cats: Category[],
    parent: string | null = null,
    prefix = ""
  ): { label: string; value: string }[] => {
    return cats
      .filter((c) => c.parentId === parent && c._id !== id)
      .flatMap((cat) => {
        const label = prefix + cat.name;
        const children = buildOptions(cats, cat._id, label + " > ");
        return [{ label, value: cat._id }, ...children];
      });
  };

  return (
    <div className="w-full p-6 md:p-10">
      <Link
        href="/admin/categories"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to All Categories
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-orange-600">Edit Category</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
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
            {buildOptions(categories).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
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
              setPreview(file ? URL.createObjectURL(file) : preview);
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
          Update Category
        </Button>
      </form>
    </div>
  );
}
