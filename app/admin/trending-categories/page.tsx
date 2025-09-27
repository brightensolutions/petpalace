// File: app/admin/trending-categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  parentId: string | null;
}

export default function TrendingCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await fetch("/api/admin/categories");
        const catJson = await catRes.json();

        // Fetch trending categories
        const trendingRes = await fetch("/api/admin/trending-categories");
        const trendingJson = await trendingRes.json();

        if (catJson.success) {
          setCategories(catJson.data);
        } else {
          toast.error("Failed to load categories");
        }

        if (trendingJson.success) {
          setTrending(trendingJson.data.map((t: any) => t.categoryId));
        }
      } catch (err) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleTrending = (id: string) => {
    setTrending((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const saveTrending = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/trending-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: trending }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Trending categories updated!");
      } else {
        toast.error("Failed to save trending categories");
      }
    } catch (err) {
      toast.error("Error saving trending categories");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-blue-600">Loading...</p>;

  // Group categories by parent
  const parentCategories = categories.filter((c) => !c.parentId);
  const childCategories = categories.filter((c) => c.parentId);

  const grouped: Record<string, Category[]> = {};
  parentCategories.forEach((parent) => {
    grouped[parent._id] = childCategories.filter(
      (c) => c.parentId === parent._id
    );
  });

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
        <div className="grid gap-1 pt-6">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Trending Categories
          </CardTitle>
          <CardDescription className="text-gray-500">
            Select up to 16 categories to display in the trending section.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {parentCategories.map((parent) => (
          <Card
            key={parent._id}
            className="border rounded-lg shadow-sm bg-gradient-to-r from-orange-50 to-blue-50"
          >
            <CardHeader>
              <CardTitle className="text-lg text-orange-600">
                {parent.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {grouped[parent._id] && grouped[parent._id].length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {grouped[parent._id].map((child) => (
                    <label
                      key={child._id}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-orange-100 transition"
                    >
                      <input
                        type="checkbox"
                        checked={trending.includes(child._id)}
                        onChange={() => toggleTrending(child._id)}
                        className="h-4 w-4 text-orange-500 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{child.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No subcategories</p>
              )}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button
            onClick={saveTrending}
            disabled={saving}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
