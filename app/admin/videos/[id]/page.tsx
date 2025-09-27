"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Video {
  _id: string;
  title: string;
  url: string;
  thumbnail?: string;
}

export default function EditVideoPage() {
  const router = useRouter();
  const { id } = useParams();

  const [video, setVideo] = useState<Video>({
    _id: "",
    title: "",
    url: "",
    thumbnail: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/admin/videos/${id}`);
        const json = await res.json();
        if (json.success) {
          setVideo(json.data);
        } else {
          toast.error("Failed to load video");
        }
      } catch (err) {
        toast.error("Error fetching video");
      }
    };
    fetchVideo();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(video),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Video updated successfully");
        router.push("/admin/videos");
      } else {
        toast.error("Failed to update video");
      }
    } catch (err) {
      toast.error("Error updating video");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Edit Video</h1>
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <Input
            type="text"
            value={video.title}
            onChange={(e) => setVideo({ ...video, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Video URL</label>
          <Input
            type="text"
            value={video.url}
            onChange={(e) => setVideo({ ...video, url: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Thumbnail URL</label>
          <Input
            type="text"
            value={video.thumbnail || ""}
            onChange={(e) => setVideo({ ...video, thumbnail: e.target.value })}
          />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Update Video"}
        </Button>
      </div>
    </div>
  );
}
