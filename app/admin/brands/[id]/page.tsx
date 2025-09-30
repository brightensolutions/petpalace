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

interface Brand {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export default function EditBrandPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await fetch(`/api/admin/brands/${id}`);
        const json = await res.json();
        if (res.ok && json.success) {
          const brand = json.data;
          setName(brand.name);
          setSlug(brand.slug);
          setPreview(brand.image || null);
        } else {
          toast.error("Failed to fetch brand");
        }
      } catch (err) {
        toast.error("Error fetching brand");
      }
    };

    fetchBrand();
  }, [id]);

  useEffect(() => {
    setSlug(slugify(name, { lower: true }));
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        toast.success("Brand updated successfully!");
        router.push("/admin/brands");
      } else {
        const json = await res.json();
        toast.error(json.message || "Failed to update brand");
      }
    } catch (err) {
      toast.error("Server error while updating brand");
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

      <h1 className="text-3xl font-bold mb-6 text-orange-600">Edit Brand</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Brand Name</Label>
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
          <Label htmlFor="image">Upload Brand Logo</Label>
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
          Update Brand
        </Button>
      </form>
    </div>
  );
}
