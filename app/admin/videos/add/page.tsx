"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AddVideoPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a video title.");
      return;
    }
    if (!videoFile) {
      toast.error("Please upload a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", videoFile);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Video successfully added!");
        router.push("/admin/videos");
      } else {
        toast.error("Error adding video");
      }
    } catch (err) {
      toast.error("Server error. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="w-full p-6 md:p-10">
      <Link
        href="/admin/videos"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to All Videos
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-orange-600">Add New Video</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Title */}
        <div>
          <Label htmlFor="title">Video Title</Label>
          <Input
            id="title"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Video File Upload */}
        <div>
          <Label htmlFor="video">Upload Video</Label>
          <Input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* Thumbnail Upload */}
        <div>
          <Label htmlFor="thumbnail">Thumbnail (Optional)</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setThumbnailFile(file);
              setThumbnailPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
          {thumbnailPreview && (
            <Image
              src={thumbnailPreview}
              alt="Thumbnail Preview"
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
          Add Video
        </Button>
      </form>
    </div>
  );
}
