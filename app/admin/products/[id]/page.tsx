"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TiptapEditor from "@/components/tiptap-editor";
import { XIcon, GripVertical, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  parentId?: string | null;
  parent?: { _id: string; name: string } | null;
}
interface Brand {
  _id: string;
  name: string;
}
interface Pack {
  label: string;
  price: number;
  stock: number;
  discount: number;
  sku: string; // Added SKU field for packs
}
interface GalleryImage {
  id: string;
  file?: File;
  previewUrl: string;
  existingUrl?: string;
}
interface Variant {
  type: "weight" | "size" | "custom";
  label: string;
  weightValue?: number;
  packs?: Pack[];
  price?: number;
  stock?: number;
  discount?: number;
  imageFile?: File;
  imagePreviewUrl?: string;
  existingImageUrl?: string;
  sku: string; // Added SKU field for variants
}

const PACK_OPTIONS = Array.from({ length: 10 }, (_, i) => `Pack of ${i + 1}`);

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params?.id;

  const [loading, setLoading] = useState(true);

  // General
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [mrpPrice, setMrpPrice] = useState<number>(0);
  const [foodType, setFoodType] = useState<"" | "veg" | "non-veg">("");
  const [hsnCode, setHsnCode] = useState("");
  const [sku, setSku] = useState("");
  const [productStock, setProductStock] = useState<number>(0);
  const [additionalProductInfo, setAdditionalProductInfo] = useState("");

  // Images
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreviewUrl, setMainImagePreviewUrl] = useState<string | null>(
    null
  );
  const [existingMainImageUrl, setExistingMainImageUrl] = useState<
    string | null
  >(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const draggedItemIndex = useRef<number | null>(null);

  // Taxonomies
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Variants
  const [variants, setVariants] = useState<Variant[]>([]);

  // Cleanup refs
  const latestState = useRef({
    mainImagePreviewUrl: null as string | null,
    galleryImages: [] as GalleryImage[],
    variants: [] as Variant[],
  });
  useEffect(() => {
    latestState.current = { mainImagePreviewUrl, galleryImages, variants };
  }, [mainImagePreviewUrl, galleryImages, variants]);
  useEffect(
    () => () => {
      const { mainImagePreviewUrl, galleryImages, variants } =
        latestState.current;
      if (mainImagePreviewUrl?.startsWith("blob:"))
        URL.revokeObjectURL(mainImagePreviewUrl);
      galleryImages.forEach((img) => {
        if (img.previewUrl?.startsWith("blob:"))
          URL.revokeObjectURL(img.previewUrl);
      });
      variants.forEach((v) => {
        if (v.imagePreviewUrl?.startsWith("blob:"))
          URL.revokeObjectURL(v.imagePreviewUrl);
      });
    },
    []
  );

  // Fetch options
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((j) => j.success && setCategories(j.data))
      .catch(() => toast.error("Failed to load categories"));
    fetch("/api/admin/brands")
      .then((r) => r.json())
      .then((j) => j.success && setBrands(j.data))
      .catch(() => toast.error("Failed to load brands"));
  }, []);

  // Safe JSON parse helper
  function parseJsonSafe(text: string | null) {
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  // Load product
  useEffect(() => {
    if (!productId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/products/${productId}`, {
          cache: "no-store",
        });
        const text = await res.text().catch(() => null);
        const json = parseJsonSafe(text);
        if (!res.ok) {
          const message =
            (json && (json.message || json.error)) ||
            `Failed to load product (${res.status})`;
          throw new Error(message);
        }
        if (!json) {
          throw new Error("Empty or invalid JSON response from server");
        }

        // Accept multiple shapes: { success, data }, { product }, or raw object
        const p = json.data ?? json.product ?? json;

        setName(p.name || "");
        setSlug(p.slug || "");
        setDesc(p.description || "");
        setBasePrice(p.base_price ?? p.price ?? 0);
        setMrpPrice(p.mrp_price ?? p.mrp ?? 0);
        setProductStock(p.stock ?? 0);
        setFoodType(p.foodType || "");
        setHsnCode(p.hsnCode || "");
        setSku(p.sku || "");
        setAdditionalProductInfo(p.additional_info || "");

        setExistingMainImageUrl(p.main_image || null);

        const existingGallery: GalleryImage[] = (p.gallery_images || []).map(
          (url: string) => ({
            id: crypto.randomUUID(),
            previewUrl: url,
            existingUrl: url,
          })
        );
        setGalleryImages(existingGallery);

        const catIds: string[] = Array.isArray(p.categories)
          ? p.categories
          : p.category
          ? [p.category]
          : [];
        setSelectedCategories(catIds);
        const brandIds: string[] = Array.isArray(p.brands)
          ? p.brands
          : p.brand
          ? [p.brand]
          : [];
        setSelectedBrands(brandIds);

        const mappedVariants: Variant[] = (p.variants || []).map((v: any) => ({
          type: v.type || "custom",
          label: v.label || "",
          weightValue: v.weight_value,
          packs: (v.packs || []).map((pk: any) => ({
            label: pk.label,
            price: pk.price_per_unit ?? pk.price ?? 0,
            stock: pk.stock ?? 0,
            discount: pk.discount_percent ?? pk.discount ?? 0,
            sku: pk.sku || "", // Added SKU field for packs
          })),
          price: v.price ?? 0,
          stock: v.stock ?? 0,
          discount: v.discount_percent ?? v.discount ?? 0,
          existingImageUrl: v.image || undefined,
          sku: v.sku || "", // Added SKU field for variants
        }));
        setVariants(mappedVariants);
      } catch (e: any) {
        toast.error(e?.message || "Error loading product");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  const categoryTree = useMemo(() => {
    const getParentId = (c: Category) =>
      c.parentId ??
      (c.parent as unknown as { _id?: string } | null)?._id ??
      null;

    // Separate parents and children
    const parents = categories.filter((c) => !getParentId(c));
    const childrenMap = new Map<string, Category[]>();

    // Build children map
    categories.forEach((c) => {
      const pid = getParentId(c);
      if (pid) {
        const list = childrenMap.get(pid) ?? [];
        list.push(c);
        childrenMap.set(pid, list);
      }
    });

    // Recursive function to build tree with depth
    const buildTree = (parentId: string | null, depth = 0): any[] => {
      const children = parentId
        ? (childrenMap.get(parentId) ?? []).sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        : parents.sort((a, b) => a.name.localeCompare(b.name));

      return children.flatMap((cat) => [
        { ...cat, depth },
        ...buildTree(cat._id, depth + 1),
      ]);
    };

    return buildTree(null);
  }, [categories]);

  const leafCategories = useMemo(() => {
    const getParentId = (c: Category) =>
      c.parentId ??
      (c.parent as unknown as { _id?: string } | null)?._id ??
      null;

    const childrenMap = new Map<string, Category[]>();

    // Build children map
    categories.forEach((c) => {
      const pid = getParentId(c);
      if (pid) {
        const list = childrenMap.get(pid) ?? [];
        list.push(c);
        childrenMap.set(pid, list);
      }
    });

    // A category is a leaf if it has no children
    return new Set(
      categories.filter((c) => !childrenMap.has(c._id)).map((c) => c._id)
    );
  }, [categories]);

  const getParentChain = useCallback(
    (categoryId: string): string[] => {
      const chain: string[] = [categoryId];
      let currentCategory = categories.find((c) => c._id === categoryId);

      while (currentCategory) {
        const getParentId = (c: Category) =>
          c.parentId ??
          (c.parent as unknown as { _id?: string } | null)?._id ??
          null;

        const parentId = getParentId(currentCategory);
        if (!parentId) break;

        chain.push(parentId);
        currentCategory = categories.find((c) => c._id === parentId);
      }

      return chain;
    },
    [categories]
  );

  const toggleCategoryCheckbox = useCallback(
    (id: string) => {
      setSelectedCategories((prev) => {
        if (prev.includes(id)) {
          // Remove this category and check if any other selected categories need its parents
          const newSelected = prev.filter((catId) => catId !== id);

          // Get all parent chains for remaining selected categories
          const allNeededCategories = new Set<string>();
          newSelected.forEach((catId) => {
            if (leafCategories.has(catId)) {
              getParentChain(catId).forEach((parentId) =>
                allNeededCategories.add(parentId)
              );
            }
          });

          return Array.from(allNeededCategories);
        } else {
          // Add this category and all its parents
          const chain = getParentChain(id);
          return Array.from(new Set([...prev, ...chain]));
        }
      });
    },
    [leafCategories, getParentChain]
  );

  // Handlers
  const toggleCheckbox = (
    id: string,
    selected: string[],
    setSelected: (v: string[]) => void
  ) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((i) => i !== id)
        : [...selected, id]
    );
  };
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMainImageFile(file);
    if (mainImagePreviewUrl) URL.revokeObjectURL(mainImagePreviewUrl);
    setMainImagePreviewUrl(file ? URL.createObjectURL(file) : null);
  };
  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFiles = Array.from(e.target.files || []);
    const newGallery: GalleryImage[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setGalleryImages((prev) => [...prev, ...newGallery]);
  };
  const handleRemoveGalleryImage = (idToRemove: string) => {
    setGalleryImages((prev) => {
      const img = prev.find((g) => g.id === idToRemove);
      if (img?.previewUrl?.startsWith("blob:"))
        URL.revokeObjectURL(img.previewUrl);
      return prev.filter((g) => g.id !== idToRemove);
    });
  };
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, id: string) => {
      draggedItemIndex.current = galleryImages.findIndex(
        (img) => img.id === id
      );
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", (e.target as HTMLElement).outerHTML);
    },
    [galleryImages]
  );
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropId: string) => {
      e.preventDefault();
      const draggedIndex = draggedItemIndex.current;
      const dropIndex = galleryImages.findIndex((img) => img.id === dropId);
      if (
        draggedIndex === null ||
        draggedIndex === dropIndex ||
        dropIndex === -1
      )
        return;
      const next = [...galleryImages];
      const [dragged] = next.splice(draggedIndex, 1);
      next.splice(dropIndex, 0, dragged);
      setGalleryImages(next);
      draggedItemIndex.current = null;
    },
    [galleryImages]
  );

  const addVariant = () =>
    setVariants((prev) => [
      ...prev,
      { type: "custom", label: "", price: 0, stock: 0, discount: 0, sku: "" }, // Added SKU field for variants
    ]);
  const removeVariant = (index: number) => {
    setVariants((prev) => {
      const v = prev[index];
      if (v?.imagePreviewUrl?.startsWith("blob:"))
        URL.revokeObjectURL(v.imagePreviewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };
  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== index) return v;
        let updated = { ...v, [field]: value };
        if (field === "type") {
          updated =
            value === "weight"
              ? { ...updated, type: value, weightValue: 0, packs: [] }
              : {
                  ...updated,
                  type: value,
                  price: 0,
                  stock: 0,
                  discount: 0,
                  weightValue: undefined,
                  packs: undefined,
                };
        }
        if (field === "imageFile" && value instanceof File) {
          if (v.imagePreviewUrl?.startsWith("blob:"))
            URL.revokeObjectURL(v.imagePreviewUrl);
          updated.imagePreviewUrl = URL.createObjectURL(value);
          updated.existingImageUrl = undefined;
        } else if (field === "imageFile" && value === null) {
          if (v.imagePreviewUrl?.startsWith("blob:"))
            URL.revokeObjectURL(v.imagePreviewUrl);
          updated.imagePreviewUrl = undefined;
        }
        return updated;
      })
    );
  };
  const addPack = (vi: number) =>
    setVariants((prev) =>
      prev.map((v, i) =>
        i === vi
          ? {
              ...v,
              packs: [
                ...(v.packs || []),
                {
                  label: PACK_OPTIONS[0],
                  price: 0,
                  stock: 0,
                  discount: 0,
                  sku: "",
                }, // Added SKU field for packs
              ],
            }
          : v
      )
    );
  const removePack = (vi: number, pi: number) =>
    setVariants((prev) =>
      prev.map((v, i) =>
        i === vi ? { ...v, packs: v.packs?.filter((_, idx) => idx !== pi) } : v
      )
    );
  const updatePack = (vi: number, pi: number, field: keyof Pack, value: any) =>
    setVariants((prev) =>
      prev.map((v, i) =>
        i === vi
          ? {
              ...v,
              packs: v.packs?.map((p, idx) =>
                idx === pi ? { ...p, [field]: value } : p
              ),
            }
          : v
      )
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", desc);
    formData.append("price", basePrice.toString());
    formData.append("mrp", mrpPrice.toString());
    formData.append("stock", productStock.toString());
    if (foodType) formData.append("foodType", foodType);
    if (hsnCode) formData.append("hsnCode", hsnCode);
    if (sku) formData.append("sku", sku);
    formData.append("additional_info", additionalProductInfo);
    if (mainImageFile) formData.append("mainImage", mainImageFile);
    galleryImages.forEach((img) => {
      if (img.file) formData.append("galleryImages", img.file);
      else if (img.existingUrl)
        formData.append("existingGalleryImages", img.existingUrl);
    });
    selectedCategories.forEach((id) => formData.append("categories", id));
    selectedBrands.forEach((id) => formData.append("brands", id));
    variants.forEach((v, i) => {
      formData.append(`variants[${i}][type]`, v.type);
      formData.append(`variants[${i}][label]`, v.label);
      formData.append(`variants[${i}][sku]`, v.sku); // Added SKU field for variants
      if (v.type === "weight") {
        formData.append(
          `variants[${i}][weight_value]`,
          v.weightValue?.toString() || "0"
        );
        v.packs?.forEach((p, pi) => {
          formData.append(`variants[${i}][packs][${pi}][label]`, p.label);
          formData.append(
            `variants[${i}][packs][${pi}][price_per_unit]`,
            p.price.toString()
          );
          formData.append(
            `variants[${i}][packs][${pi}][stock]`,
            p.stock.toString()
          );
          formData.append(
            `variants[${i}][packs][${pi}][discount_percent]`,
            p.discount.toString()
          );
          formData.append(`variants[${i}][packs][${pi}][sku]`, p.sku); // Added SKU field for packs
        });
      } else {
        formData.append(`variants[${i}][price]`, v.price?.toString() || "0");
        formData.append(`variants[${i}][stock]`, v.stock?.toString() || "0");
        formData.append(
          `variants[${i}][discount_percent]`,
          v.discount?.toString() || "0"
        );
      }
      if (v.imageFile) formData.append(`variants[${i}][image]`, v.imageFile);
      else if (v.existingImageUrl)
        formData.append(`variants[${i}][existing_image]`, v.existingImageUrl);
    });

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        body: formData,
      });
      // Handle 204 No Content or empty responses gracefully
      if (res.status === 204) {
        toast.success("Product updated successfully!");
        router.push("/admin/products");
        return;
      }
      const text = await res.text().catch(() => null);
      const json = parseJsonSafe(text);

      if (!res.ok) {
        const message =
          (json && (json.message || json.error)) ||
          `Error updating product (${res.status})`;
        toast.error(message);
        return;
      }

      const success = json?.success ?? true; // assume success if API doesn't send flag
      if (success) {
        toast.success("Product updated successfully!");
        router.push("/admin/products");
      } else {
        toast.error(json?.message || "Error updating product");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const liveLink = useMemo(
    () =>
      slug ? `/products/${slug}` : productId ? `/products/${productId}` : "#",
    [slug, productId]
  );

  if (loading) return <div className="p-6 md:p-10">Loading...</div>;

  return (
    <div className="w-full p-6 md:p-10">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/admin/products"
          className="text-sm text-blue-600 hover:underline"
        >
          {"← Back to Products"}
        </Link>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.open(liveLink, "_blank", "noopener,noreferrer")}
        >
          View Live
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-orange-600">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" type="button">
              General
            </TabsTrigger>
            <TabsTrigger value="categorization" type="button">
              Categorization
            </TabsTrigger>
            <TabsTrigger value="images" type="button">
              Images
            </TabsTrigger>
            <TabsTrigger value="variants" type="button">
              Variants
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="general"
            className="space-y-4 p-4 border rounded-md mt-4"
          >
            <div>
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="product-slug">Slug</Label>
              <Input
                id="product-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="product-description">Description</Label>
              <TiptapEditor value={desc} onChange={setDesc} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="base-price">Base Price</Label>
                <Input
                  id="base-price"
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(+e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="mrp-price">MRP Price</Label>
                <Input
                  id="mrp-price"
                  type="number"
                  value={mrpPrice}
                  onChange={(e) => setMrpPrice(+e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="product-stock">Product Stock</Label>
                <Input
                  id="product-stock"
                  type="number"
                  value={productStock}
                  onChange={(e) => setProductStock(+e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hsn-code">HSN Code (Optional)</Label>
                <Input
                  id="hsn-code"
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                  placeholder="e.g., 1234567890"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU (Optional)</Label>
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g., PROD-001"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="food-type">Food Type</Label>
              <Select
                value={foodType}
                onValueChange={(value: "" | "veg" | "non-veg") =>
                  setFoodType(value)
                }
              >
                <SelectTrigger id="food-type">
                  <SelectValue placeholder="Select food type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="veg">Vegetarian</SelectItem>
                  <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="additional-product-info">
                Additional Product Information
              </Label>
              <TiptapEditor
                value={additionalProductInfo}
                onChange={setAdditionalProductInfo}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="categorization"
            className="space-y-4 p-4 border rounded-md mt-4"
          >
            <div>
              <Label>Categories</Label>
              <p className="text-sm text-muted-foreground mt-1 mb-2">
                Select the most specific subcategories. Parent categories will
                be included automatically.
              </p>
              <div className="mt-2 border rounded-md p-4 max-h-96 overflow-y-auto bg-white">
                {categoryTree.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No categories available
                  </p>
                ) : (
                  <div className="space-y-1">
                    {categoryTree.map((cat) => {
                      const getParentId = (c: Category) =>
                        c.parentId ??
                        (c.parent as unknown as { _id?: string } | null)?._id ??
                        null;
                      const parentId = getParentId(cat);
                      const parentName = parentId
                        ? categories.find((c) => c._id === parentId)?.name
                        : null;

                      const isLeaf = leafCategories.has(cat._id);
                      const isSelected = selectedCategories.includes(cat._id);
                      const isAutoSelected = isSelected && !isLeaf;

                      return (
                        <label
                          key={cat._id}
                          className={`flex items-start gap-2 text-sm hover:bg-gray-50 p-1 rounded ${
                            isLeaf
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-60"
                          }`}
                          style={{ paddingLeft: `${cat.depth * 20 + 4}px` }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!isLeaf}
                            onChange={() => toggleCategoryCheckbox(cat._id)}
                            className="form-checkbox h-4 w-4 text-orange-600 rounded mt-0.5 flex-shrink-0 disabled:cursor-not-allowed"
                          />
                          <span className="flex-1">
                            {cat.name}
                            {!isLeaf && (
                              <span className="text-xs text-muted-foreground ml-2">
                                (parent category)
                              </span>
                            )}
                            {isAutoSelected && (
                              <span className="text-xs text-blue-600 ml-2">
                                (auto-selected)
                              </span>
                            )}
                            {parentName && isLeaf && (
                              <span className="text-xs text-muted-foreground ml-2">
                                (under {parentName})
                              </span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label>Brands</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-2">
                {brands.map((brand) => (
                  <label
                    key={brand._id}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand._id)}
                      onChange={() =>
                        toggleCheckbox(
                          brand._id,
                          selectedBrands,
                          setSelectedBrands
                        )
                      }
                      className="form-checkbox h-4 w-4 text-orange-600 rounded"
                    />
                    {brand.name}
                  </label>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="images"
            className="space-y-4 p-4 border rounded-md mt-4"
          >
            <div>
              <Label htmlFor="main-image">Main Image</Label>
              <Input
                id="main-image"
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
              />
              <div className="mt-2 flex gap-3">
                {existingMainImageUrl && !mainImagePreviewUrl && (
                  <div className="w-32 h-32 border rounded-md overflow-hidden flex items-center justify-center">
                    <img
                      src={existingMainImageUrl || "/placeholder.svg"}
                      alt="Current Main"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                {mainImagePreviewUrl && (
                  <div className="w-32 h-32 border rounded-md overflow-hidden flex items-center justify-center">
                    <img
                      src={mainImagePreviewUrl || "/placeholder.svg"}
                      alt="New Main Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="gallery-images">Gallery Images</Label>
              <Input
                id="gallery-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImagesChange}
              />
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {galleryImages.map((img, index) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
                      handleDragStart(e, img.id)
                    }
                    onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
                      handleDragOver(e)
                    }
                    onDrop={(e: React.DragEvent<HTMLDivElement>) =>
                      handleDrop(e, img.id)
                    }
                    className="relative group border rounded-md overflow-hidden flex flex-col items-center justify-center aspect-square cursor-grab"
                  >
                    <img
                      src={img.previewUrl || "/placeholder.svg"}
                      alt={`Gallery Image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveGalleryImage(img.id)}
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove gallery image ${index + 1}`}
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                    <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                      <GripVertical className="h-4 w-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="variants"
            className="space-y-4 p-4 border rounded-md mt-4"
          >
            <div className="flex justify-between items-center mb-4">
              <Label>Variants</Label>
              <Button type="button" variant="outline" onClick={addVariant}>
                {" + Add Variant"}
              </Button>
            </div>
            {variants.map((v, i) => (
              <div
                key={i}
                className="border p-4 rounded space-y-3 mb-4 bg-gray-50 relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVariant(i)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`variant-type-${i}`}>Variant Type</Label>
                    <Select
                      value={v.type}
                      onValueChange={(value: "weight" | "size" | "custom") =>
                        updateVariant(i, "type", value)
                      }
                    >
                      <SelectTrigger id={`variant-type-${i}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight">Weight</SelectItem>
                        <SelectItem value="size">Size</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`variant-label-${i}`}>Variant Label</Label>
                    <Input
                      id={`variant-label-${i}`}
                      placeholder="e.g. 1kg, Small, Red"
                      value={v.label}
                      onChange={(e) =>
                        updateVariant(i, "label", e.target.value)
                      }
                    />
                  </div>
                </div>

                {v.type === "weight" && (
                  <div className="space-y-3 border p-3 rounded bg-gray-100">
                    <div>
                      <Label htmlFor={`variant-weight-value-${i}`}>
                        Weight Value (e.g., 1 for 1kg)
                      </Label>
                      <Input
                        id={`variant-weight-value-${i}`}
                        type="number"
                        placeholder="Weight value"
                        value={v.weightValue || ""}
                        onChange={(e) =>
                          updateVariant(i, "weightValue", +e.target.value)
                        }
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Packs</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addPack(i)}
                      >
                        {" + Add Pack"}
                      </Button>
                    </div>
                    {v.packs?.map((pack, pi) => (
                      <div
                        key={pi}
                        className="border p-3 rounded space-y-2 bg-white relative"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePack(i, pi)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <Label htmlFor={`pack-label-${i}-${pi}`}>
                              Pack Label
                            </Label>
                            <Select
                              value={pack.label}
                              onValueChange={(val) =>
                                updatePack(i, pi, "label", val)
                              }
                            >
                              <SelectTrigger id={`pack-label-${i}-${pi}`}>
                                <SelectValue placeholder="Select pack" />
                              </SelectTrigger>
                              <SelectContent>
                                {PACK_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`pack-price-${i}-${pi}`}>
                              Price
                            </Label>
                            <Input
                              id={`pack-price-${i}-${pi}`}
                              type="number"
                              value={pack.price}
                              onChange={(e) =>
                                updatePack(i, pi, "price", +e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pack-stock-${i}-${pi}`}>
                              Stock
                            </Label>
                            <Input
                              id={`pack-stock-${i}-${pi}`}
                              type="number"
                              value={pack.stock}
                              onChange={(e) =>
                                updatePack(i, pi, "stock", +e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pack-discount-${i}-${pi}`}>
                              Discount %
                            </Label>
                            <Input
                              id={`pack-discount-${i}-${pi}`}
                              type="number"
                              value={pack.discount}
                              onChange={(e) =>
                                updatePack(i, pi, "discount", +e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pack-sku-${i}-${pi}`}>SKU</Label>
                            <Input
                              id={`pack-sku-${i}-${pi}`}
                              value={pack.sku}
                              onChange={(e) =>
                                updatePack(i, pi, "sku", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(v.type === "size" || v.type === "custom") && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor={`variant-price-${i}`}>Price</Label>
                      <Input
                        id={`variant-price-${i}`}
                        type="number"
                        value={v.price || ""}
                        onChange={(e) =>
                          updateVariant(i, "price", +e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`variant-stock-${i}`}>Stock</Label>
                      <Input
                        id={`variant-stock-${i}`}
                        type="number"
                        value={v.stock || ""}
                        onChange={(e) =>
                          updateVariant(i, "stock", +e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`variant-discount-${i}`}>
                        Discount %
                      </Label>
                      <Input
                        id={`variant-discount-${i}`}
                        type="number"
                        value={v.discount || ""}
                        onChange={(e) =>
                          updateVariant(i, "discount", +e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`variant-sku-${i}`}>SKU</Label>
                      <Input
                        id={`variant-sku-${i}`}
                        value={v.sku}
                        onChange={(e) =>
                          updateVariant(i, "sku", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor={`variant-image-${i}`}>Variant Image</Label>
                  <Input
                    id={`variant-image-${i}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      updateVariant(i, "imageFile", e.target.files?.[0] || null)
                    }
                  />
                  <div className="mt-2 flex gap-3">
                    {v.existingImageUrl && !v.imagePreviewUrl && (
                      <div className="w-24 h-24 border rounded-md overflow-hidden flex items-center justify-center">
                        <img
                          src={v.existingImageUrl || "/placeholder.svg"}
                          alt="Current Variant"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    {v.imagePreviewUrl && (
                      <div className="w-24 h-24 border rounded-md overflow-hidden flex items-center justify-center">
                        <img
                          src={v.imagePreviewUrl || "/placeholder.svg"}
                          alt="Variant Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              window.open(liveLink, "_blank", "noopener,noreferrer")
            }
          >
            View Live
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
