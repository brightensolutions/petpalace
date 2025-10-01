"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner"; // ✅ Same toast style as sliders

export default function ManageTopbarContentPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch current topbar content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/admin/topbar-content");
        const json = await res.json();
        if (res.ok) {
          setContent(json?.content || "");
        } else {
          toast.error("Failed to load topbar content");
        }
      } catch (error) {
        toast.error("Error fetching topbar content");
      }
    };
    fetchContent();
  }, []);

  // Save / update topbar content
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/topbar-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        toast.success("Topbar content updated successfully!");
      } else {
        toast.error("Failed to update topbar content.");
      }
    } catch (error) {
      toast.error("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
        <div className="grid gap-1 pt-6">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Topbar Content
          </CardTitle>
          <CardDescription className="text-gray-500">
            Manage the text displayed in the topbar across the website.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Enter topbar text..."
            className="sm:w-2/3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
