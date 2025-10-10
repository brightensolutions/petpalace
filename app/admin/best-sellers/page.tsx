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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import { Search, X } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  images: string[];
  price: number;
  salePrice?: number;
  category?: { name: string };
  brand?: { name: string };
}

export default function BestsellersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current bestsellers
        const bestRes = await fetch("/api/admin/bestsellers");
        const bestJson = await bestRes.json();

        if (bestJson.success) {
          setSelectedProducts(bestJson.data.map((b: any) => b.productId));
        }
      } catch (err) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const res = await fetch(
        `/api/admin/products?search=${encodeURIComponent(query)}`
      );
      const json = await res.json();

      if (json.success) {
        setSearchResults(json.data);
      } else {
        toast.error("Failed to search products");
      }
    } catch (err) {
      toast.error("Error searching products");
    } finally {
      setSearching(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    searchProducts(value);
  };

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p !== id));
  };

  const saveBestsellers = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/bestsellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: selectedProducts }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Bestsellers updated!");
      } else {
        toast.error("Failed to save bestsellers");
      }
    } catch (err) {
      toast.error("Error saving bestsellers");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-orange-600">Loading...</p>;

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
        <div className="grid gap-1 pt-6">
          <CardTitle className="text-2xl font-bold text-orange-700">
            Bestseller Products
          </CardTitle>
          <CardDescription className="text-gray-500">
            Search and select products to display in the bestsellers section.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border-2 border-gray-300 focus:border-orange-400 rounded-lg"
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <Card className="border-2 border-orange-200 rounded-lg shadow-sm bg-gradient-to-r from-orange-50 to-white max-h-96 overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-lg text-orange-600">
                Search Results ({searchResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searching ? (
                <p className="text-gray-500">Searching...</p>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((product) => (
                    <label
                      key={product._id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-orange-100 transition cursor-pointer border border-gray-200"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => toggleProduct(product._id)}
                        className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500"
                      />
                      <div className="flex-1 flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {product.category?.name} • {product.brand?.name}
                          </p>
                          <p className="text-sm font-bold text-orange-600">
                            ₹{product.salePrice || product.price}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No products found</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Selected Products */}
        <Card className="border-2 border-orange-200 rounded-lg shadow-sm bg-gradient-to-r from-orange-50 to-white">
          <CardHeader>
            <CardTitle className="text-lg text-orange-600">
              Selected Bestsellers ({selectedProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedProducts.map((productId, index) => {
                  const product = searchResults.find(
                    (p) => p._id === productId
                  );
                  if (!product) return null;

                  return (
                    <div
                      key={productId}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-white border border-orange-200"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {product.category?.name}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProduct(productId)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No products selected. Search and select products above.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={saveBestsellers}
            disabled={saving || selectedProducts.length === 0}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
