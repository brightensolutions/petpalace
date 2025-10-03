"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, Search, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function formatINR(n: number) {
  try {
    return new Intl.NumberFormat("en-IN").format(n);
  } catch {
    return String(n);
  }
}

function computeDiscount(mrp?: number | null, base?: number | null) {
  if (!mrp || !base || mrp <= 0 || base >= mrp) return 0;
  return Math.round(((mrp - base) / mrp) * 100);
}

// Recursive category tree
function CategoryTree({ categories, parentId, selected, setSelected }: any) {
  const children = categories.filter(
    (c: any) => String(c.parentId) === String(parentId)
  );

  if (!children.length) return null;

  return (
    <ul className="pl-4 border-l border-gray-200">
      {children.map((c: any) => (
        <li key={c._id} className="mb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(c._id)}
              onChange={() =>
                setSelected((prev: string[]) =>
                  prev.includes(c._id)
                    ? prev.filter((id) => id !== c._id)
                    : [...prev, c._id]
                )
              }
              className="accent-orange-500"
            />
            {c.name}
          </label>
          <CategoryTree
            categories={categories}
            parentId={c._id}
            selected={selected}
            setSelected={setSelected}
          />
        </li>
      ))}
    </ul>
  );
}

export default function CategoryClient({
  categories,
  products,
  categoryTitle,
}: any) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Filter products based on selected category ids
  const filteredProducts =
    selectedCategories.length > 0
      ? products.filter((p: any) =>
          selectedCategories.includes(p.category?._id)
        )
      : products;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border sticky top-4 h-[80vh] overflow-y-auto">
          <div className="p-4 border-b flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-orange-500 capitalize mb-1">
              Filters
            </h3>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10 text-sm"
              />
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-orange-500">
                Categories
              </h4>
              <CategoryTree
                categories={categories}
                parentId={null}
                selected={selectedCategories}
                setSelected={setSelectedCategories}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="lg:col-span-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border p-10 text-center text-gray-600">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((p: any) => {
              const discountedPrice = p.base_price ?? p.mrp ?? 0;
              const originalPrice = p.mrp ?? p.base_price ?? 0;
              const computed = computeDiscount(p.mrp, p.base_price);
              const discount =
                Number.isFinite(computed) && computed > 0
                  ? computed
                  : p.discount ?? 0;

              return (
                <Card
                  key={p._id}
                  className="group hover:shadow-lg transition-all duration-300 bg-white border"
                >
                  <CardContent className="p-0">
                    <Link href={`/products/${p.slug}`} className="block">
                      <div className="relative overflow-hidden">
                        <Image
                          src={p.main_image || "/placeholder.svg"}
                          alt={p.name || "Product image"}
                          width={200}
                          height={160}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {discount > 0 && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="p-3">
                      <Link href={`/products/${p.slug}`}>
                        <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 leading-tight hover:text-blue-600 cursor-pointer">
                          {p.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{formatINR(discountedPrice)}
                          </span>
                          {originalPrice > discountedPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{formatINR(originalPrice)}
                            </span>
                          )}
                        </div>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-xs rounded-lg flex items-center gap-1">
                          <ShoppingCart className="w-3 h-3" /> Add
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
