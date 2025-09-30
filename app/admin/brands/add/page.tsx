"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AddBrandPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Auto-generate slug from brand name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(slugify(val, { lower: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Brand successfully added!");
        router.push("/admin/brands");
      } else {
        toast.error("Error adding brand");
      }
    } catch (err) {
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="w-full p-6 md:p-10">
      <Link
        href="/admin/brands"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to All Brands
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-orange-600">Add New Brand</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Brand Name</Label>
          <Input
            id="name"
            placeholder="e.g. Royal Canin"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug (auto-generated)</Label>
          <Input id="slug" value={slug} disabled />
        </div>

        <div>
          <Label htmlFor="image">Upload Brand Logo</Label>
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
          Add Brand
        </Button>
      </form>
    </div>
  );
}
