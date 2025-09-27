"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EditSliderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [link, setLink] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/sliders/${id}`);
        const json = await res.json();

        if (res.ok && json.success) {
          const slider = json.data;
          setLink(slider.link || "");
          setPreview(slider.image || null);
        } else {
          toast.error("Failed to fetch slider.");
        }
      } catch (err) {
        toast.error("Failed to load slider data.");
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!preview && !image) {
      toast.error("Please upload an image.");
      return;
    }

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("link", link);

    try {
      const res = await fetch(`/api/admin/sliders/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        toast.success("Slider updated successfully!");
        router.push("/admin/sliders");
      } else {
        toast.error("Update failed.");
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

      <h1 className="text-3xl font-bold mb-6 text-orange-600">Edit Slider</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="link">Slider Link</Label>
          <Input
            id="link"
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

        <Button
          type="submit"
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          Update Slider
        </Button>
      </form>
    </div>
  );
}
