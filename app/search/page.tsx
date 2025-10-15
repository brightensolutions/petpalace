"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  SlidersHorizontal,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartService } from "@/lib/services/cart-service";

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

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-2 hover:text-orange-600 transition-colors"
      >
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

function FilterContent({
  allParentCategories,
  productCategories,
  brands,
  priceRanges,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  selectedPriceRanges,
  setSelectedPriceRanges,
  inStockOnly,
  setInStockOnly,
  hasActiveFilters,
  clearAllFilters,
}: any) {
  return (
    <>
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-bold text-orange-600">Filters</h3>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-100 font-semibold"
            >
              <X className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* All Parent Categories */}
        {allParentCategories && allParentCategories.length > 0 && (
          <FilterSection title="Browse Categories" defaultOpen={true}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allParentCategories.map((cat: any) => (
                <Link
                  key={cat._id}
                  href={`/categories/${cat.slug}`}
                  className="block text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-2 py-1.5 rounded-md transition-all font-medium"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Product Categories (for filtering) */}
        {productCategories && productCategories.length > 0 && (
          <FilterSection title="Filter by Category" defaultOpen={true}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {productCategories.map((cat: any) => (
                <label
                  key={cat._id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-orange-50 px-2 py-1.5 rounded-md transition-all group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat._id)}
                    onChange={() =>
                      setSelectedCategories((prev: string[]) =>
                        prev.includes(cat._id)
                          ? prev.filter((id) => id !== cat._id)
                          : [...prev, cat._id]
                      )
                    }
                    className="w-4 h-4 accent-orange-500 rounded"
                  />
                  <span className="text-sm group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <FilterSection title="Brands" defaultOpen={true}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand: any) => (
                <label
                  key={brand._id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-orange-50 px-2 py-1.5 rounded-md transition-all group"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand._id)}
                    onChange={() =>
                      setSelectedBrands((prev: string[]) =>
                        prev.includes(brand._id)
                          ? prev.filter((id) => id !== brand._id)
                          : [...prev, brand._id]
                      )
                    }
                    className="w-4 h-4 accent-orange-500 rounded"
                  />
                  <span className="text-sm group-hover:text-orange-600 transition-colors">
                    {brand.name}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Price Range */}
        <FilterSection title="Price Range" defaultOpen={true}>
          <div className="space-y-2">
            {priceRanges.map((range: any) => (
              <label
                key={range.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-orange-50 px-2 py-1.5 rounded-md transition-all group"
              >
                <input
                  type="checkbox"
                  checked={selectedPriceRanges.includes(range.id)}
                  onChange={() =>
                    setSelectedPriceRanges((prev: string[]) =>
                      prev.includes(range.id)
                        ? prev.filter((id) => id !== range.id)
                        : [...prev, range.id]
                    )
                  }
                  className="w-4 h-4 accent-orange-500 rounded"
                />
                <span className="text-sm group-hover:text-orange-600 transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability" defaultOpen={false}>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-orange-50 px-2 py-1.5 rounded-md transition-all group">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-orange-500 rounded"
            />
            <span className="text-sm group-hover:text-orange-600 transition-colors">
              In Stock Only
            </span>
          </label>
        </FilterSection>
      </div>
    </>
  );
}

export default function SearchClient({
  products,
  brands,
  allParentCategories,
  productCategories,
  searchQuery,
}: any) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedFoodType, setSelectedFoodType] = useState<
    "all" | "veg" | "non-veg"
  >("all");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [selectedPacks, setSelectedPacks] = useState<Record<string, number>>(
    {}
  );

  const priceRanges = [
    { id: "10-300", label: "₹10 - ₹300", min: 10, max: 300 },
    { id: "301-500", label: "₹301 - ₹500", min: 301, max: 500 },
    { id: "501-1000", label: "₹501 - ₹1,000", min: 501, max: 1000 },
    { id: "1001-2000", label: "₹1,001 - ₹2,000", min: 1001, max: 2000 },
    { id: "2001+", label: "₹2,001+", min: 2001, max: Number.POSITIVE_INFINITY },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p: any) =>
        selectedCategories.includes(p.category?._id)
      );
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p: any) =>
        selectedBrands.includes(p.brand?._id)
      );
    }

    // Filter by price ranges
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((p: any) => {
        const price = p.base_price ?? p.mrp ?? 0;
        return selectedPriceRanges.some((rangeId) => {
          const range = priceRanges.find((r) => r.id === rangeId);
          if (!range) return false;
          return price >= range.min && price <= range.max;
        });
      });
    }

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter((p: any) => (p.stock ?? 0) > 0);
    }

    if (selectedFoodType !== "all") {
      filtered = filtered.filter((p: any) => p.foodType === selectedFoodType);
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a: any, b: any) => {
          const priceA = a.base_price ?? a.mrp ?? 0;
          const priceB = b.base_price ?? b.mrp ?? 0;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a: any, b: any) => {
          const priceA = a.base_price ?? a.mrp ?? 0;
          const priceB = b.base_price ?? b.mrp ?? 0;
          return priceB - priceA;
        });
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [
    products,
    selectedCategories,
    selectedBrands,
    selectedPriceRanges,
    inStockOnly,
    selectedFoodType,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRanges([]);
    setInStockOnly(false);
    setSelectedFoodType("all");
    setSortBy("featured");
    setSelectedVariants({});
    setSelectedPacks({});
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedPriceRanges.length > 0 ||
    inStockOnly ||
    selectedFoodType !== "all" ||
    sortBy !== "featured";

  const { addToCart } = useCartService(); // Updated hook usage

  if (!searchQuery) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Start Your Search
          </h3>
          <p className="text-gray-600">
            Please enter a search query in the header to find products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <FilterContent
            allParentCategories={allParentCategories}
            productCategories={productCategories}
            brands={brands}
            priceRanges={priceRanges}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            selectedPriceRanges={selectedPriceRanges}
            setSelectedPriceRanges={setSelectedPriceRanges}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            hasActiveFilters={hasActiveFilters}
            clearAllFilters={clearAllFilters}
          />
        </div>
      </div>

      {/* Products */}
      <div className="lg:col-span-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100 font-semibold"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] sm:w-[400px] overflow-y-auto"
                >
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <FilterContent
                      allParentCategories={allParentCategories}
                      productCategories={productCategories}
                      brands={brands}
                      priceRanges={priceRanges}
                      selectedCategories={selectedCategories}
                      setSelectedCategories={setSelectedCategories}
                      selectedBrands={selectedBrands}
                      setSelectedBrands={setSelectedBrands}
                      selectedPriceRanges={selectedPriceRanges}
                      setSelectedPriceRanges={setSelectedPriceRanges}
                      inStockOnly={inStockOnly}
                      setInStockOnly={setInStockOnly}
                      hasActiveFilters={hasActiveFilters}
                      clearAllFilters={clearAllFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-gray-600">Showing</span>
                <span className="font-bold text-orange-600 text-sm sm:text-base">
                  {filteredAndSortedProducts.length}
                </span>
                <span className="text-gray-600">of</span>
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 shadow-sm border border-gray-200">
                <button
                  onClick={() => setSelectedFoodType("all")}
                  className={`px-2 py-1 text-[10px] sm:text-xs font-semibold rounded transition-all ${
                    selectedFoodType === "all"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFoodType("veg")}
                  className={`px-2 py-1 text-[10px] sm:text-xs font-semibold rounded transition-all flex items-center gap-1 ${
                    selectedFoodType === "veg"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full border border-current flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-current"></span>
                  </span>
                  Veg
                </button>
                <button
                  onClick={() => setSelectedFoodType("non-veg")}
                  className={`px-2 py-1 text-[10px] sm:text-xs font-semibold rounded transition-all flex items-center gap-1 ${
                    selectedFoodType === "non-veg"
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full border border-current flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-current"></span>
                  </span>
                  Non-Veg
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Label
                  htmlFor="sort"
                  className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap"
                >
                  Sort:
                </Label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white font-medium"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {filteredAndSortedProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-600 mb-4">
                No products found matching your criteria. Try adjusting your
                filters.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50 bg-transparent font-semibold"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredAndSortedProducts.map((p: any) => {
              const selectedVariantId = selectedVariants[p._id];
              const originalMRP = p.mrp ?? p.base_price ?? 0;
              let displayPrice = p.base_price ?? p.mrp ?? 0;
              let selectedVariantLabel = "";
              const selectedPackIndex = selectedPacks[p._id] ?? 0;
              let availablePacks: any[] = [];

              if (selectedVariantId && p.variants) {
                const variant = p.variants.find(
                  (v: any) => v._id === selectedVariantId
                );
                if (variant) {
                  selectedVariantLabel = variant.label;
                  if (
                    variant.type === "weight" &&
                    variant.packs &&
                    variant.packs.length > 0
                  ) {
                    availablePacks = variant.packs;
                    const selectedPack =
                      variant.packs[selectedPackIndex] || variant.packs[0];
                    const packPrice = selectedPack.price || 0;
                    const packDiscount = selectedPack.discount_percent || 0;
                    displayPrice = packPrice * (1 - packDiscount / 100);
                    selectedVariantLabel = `${variant.label} - ${selectedPack.label}`;
                  } else if (variant.price) {
                    displayPrice = variant.price;
                  }
                }
              }

              const computed = computeDiscount(originalMRP, displayPrice);
              const discount =
                Number.isFinite(computed) && computed > 0
                  ? computed
                  : p.discount ?? 0;

              const handleAddToCart = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart({
                  productId: p._id,
                  variantId: selectedVariantId || undefined,
                  quantity: 1,
                  price: displayPrice,
                  name: p.name,
                  image: p.main_image,
                  brand: p.brand?.name,
                  variantLabel: selectedVariantLabel || undefined,
                  foodType: p.foodType,
                });
              };

              return (
                <Card
                  key={p._id}
                  className="group hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col"
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    {discount > 0 && (
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-1.5 px-2">
                        <span className="text-xs sm:text-sm font-bold">
                          Get Extra ₹
                          {Math.round((originalMRP - displayPrice) * 0.1)} off
                        </span>
                      </div>
                    )}

                    <Link href={`/products/${p.slug}`} className="block">
                      <div className="relative overflow-hidden bg-gray-50">
                        <Image
                          src={p.main_image || "/placeholder.svg"}
                          alt={p.name || "Product image"}
                          width={300}
                          height={300}
                          className="w-full h-40 sm:h-48 object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                        />
                        <div className="absolute top-2 left-2 bg-white rounded-md shadow-md px-2 py-1 flex items-center gap-1">
                          <span className="text-orange-500 text-sm">★</span>
                          <span className="text-sm font-bold text-gray-900">
                            {p.rating || 0}
                          </span>
                        </div>
                        {p.foodType && (
                          <span
                            className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-md ${
                              p.foodType === "veg"
                                ? "border-green-600 bg-white"
                                : "border-red-600 bg-white"
                            }`}
                          >
                            <span
                              className={`w-3 h-3 rounded-full ${
                                p.foodType === "veg"
                                  ? "bg-green-600"
                                  : "bg-red-600"
                              }`}
                            ></span>
                          </span>
                        )}
                        {(p.stock ?? 0) === 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <span className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-3 sm:p-4 flex flex-col flex-grow">
                      {p.brand && (
                        <Link
                          href={`/brands/${p.brand.slug}`}
                          className="text-orange-600 hover:text-orange-700 font-semibold text-xs sm:text-sm mb-1 block"
                        >
                          {p.brand.name}
                        </Link>
                      )}

                      <Link href={`/products/${p.slug}`}>
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2 leading-tight hover:text-orange-600 cursor-pointer transition-colors">
                          {p.name}
                        </h3>
                      </Link>

                      {p.variants && p.variants.length > 0 && (
                        <div className="space-y-1.5 mb-3">
                          <div className="grid grid-cols-3 gap-1">
                            {p.variants.slice(0, 9).map((variant: any) => {
                              const isSelected =
                                selectedVariants[p._id] === variant._id;
                              const variantDiscount =
                                variant.discount_percent || discount;
                              return (
                                <button
                                  key={variant._id}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedVariants((prev) => ({
                                      ...prev,
                                      [p._id]: isSelected ? "" : variant._id,
                                    }));
                                    setSelectedPacks((prev) => ({
                                      ...prev,
                                      [p._id]: 0,
                                    }));
                                  }}
                                  className={`relative text-[8px] sm:text-[9px] px-0.5 py-1 rounded transition-all font-bold ${
                                    isSelected
                                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                      : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
                                  }`}
                                >
                                  <div className="text-center leading-tight">
                                    {variant.label}
                                  </div>
                                  {variantDiscount > 0 && (
                                    <div
                                      className={`text-[7px] mt-0.5 ${
                                        isSelected
                                          ? "text-white"
                                          : "text-green-600"
                                      } font-bold`}
                                    >
                                      {variantDiscount}%
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {availablePacks.length > 0 && (
                            <div className="grid grid-cols-3 gap-1">
                              {availablePacks.map(
                                (pack: any, packIndex: number) => {
                                  const isPackSelected =
                                    selectedPackIndex === packIndex;
                                  const packDiscount =
                                    pack.discount_percent || 0;
                                  return (
                                    <button
                                      key={packIndex}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedPacks((prev) => ({
                                          ...prev,
                                          [p._id]: packIndex,
                                        }));
                                      }}
                                      className={`relative text-[8px] sm:text-[9px] px-0.5 py-1 rounded transition-all font-bold ${
                                        isPackSelected
                                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                                          : "bg-white text-gray-700 border border-gray-300 hover:border-green-500"
                                      }`}
                                    >
                                      <div className="text-center leading-tight">
                                        {pack.label}
                                      </div>
                                      {packDiscount > 0 && (
                                        <div
                                          className={`text-[7px] mt-0.5 ${
                                            isPackSelected
                                              ? "text-white"
                                              : "text-green-600"
                                          } font-bold`}
                                        >
                                          {packDiscount}%
                                        </div>
                                      )}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-3 mt-auto">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                              ₹{formatINR(Math.round(displayPrice))}
                            </span>
                            {originalMRP > displayPrice && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500 line-through">
                                  ₹{formatINR(originalMRP)}
                                </span>
                                {discount > 0 && (
                                  <span className="text-xs text-green-600 font-semibold">
                                    ({discount}%)
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={handleAddToCart}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5"
                            disabled={(p.stock ?? 0) === 0}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add
                          </button>
                        </div>
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
