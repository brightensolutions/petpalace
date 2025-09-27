"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AddSliderPage() {
  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [link, setLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image for the slider.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("link", link);

    try {
      const res = await fetch("/api/admin/sliders", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Slider successfully added!");
        router.push("/admin/sliders");
      } else {
        toast.error("Error adding slider");
      }
    } catch (err) {
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="w-full p-6 md:p-10">
      <Link
        href="/admin/sliders"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to All Sliders
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        Add New Slider
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="link">Slider Link</Label>
          <Input
            id="link"
            placeholder="e.g. /products/dog-food"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="image">Upload Slider Image</Label>
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
              width={300}
              height={150}
              className="mt-3 rounded border"
            />
          )}
        </div>

        <Button
          type="submit"
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          Add Slider
        </Button>
      </form>
    </div>
  );
}
