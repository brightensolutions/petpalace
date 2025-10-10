"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { JSX } from "react/jsx-runtime";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category?: { _id: string; name: string };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId?: string;
}

interface CategoryNode {
  category: Category;
  children: CategoryNode[];
  products: Product[];
}

export default function EditOfferPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const offerId = params?.id;

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [type, setType] = useState<"percentage" | "amount">("percentage");
  const [value, setValue] = useState<number>(0);
  const [status, setStatus] = useState<"active" | "expired" | "scheduled">(
    "active"
  );
  const [description, setDescription] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");

  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [minCartValue, setMinCartValue] = useState<number | undefined>(
    undefined
  );
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(undefined);

  const [usageLimit, setUsageLimit] = useState<number | undefined>(undefined);
  const [perUserLimit, setPerUserLimit] = useState<number | undefined>(
    undefined
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [applicableProducts, setApplicableProducts] = useState<string[]>([]);
  const [excludedProducts, setExcludedProducts] = useState<string[]>([]);

  const [buyXGetYEnabled, setBuyXGetYEnabled] = useState(false);
  const [buyQuantity, setBuyQuantity] = useState<number>(1);
  const [getQuantity, setGetQuantity] = useState<number>(1);
  const [buyProducts, setBuyProducts] = useState<string[]>([]);
  const [getProducts, setGetProducts] = useState<string[]>([]);

  const [categoryHierarchy, setCategoryHierarchy] = useState<CategoryNode[]>(
    []
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((res) => res.json()),
      fetch("/api/admin/categories").then((res) => res.json()),
    ])
      .then(([productsJson, categoriesJson]) => {
        if (productsJson.success) setProducts(productsJson.data);
        if (categoriesJson.success) {
          setCategories(categoriesJson.data);
          buildCategoryHierarchy(categoriesJson.data, productsJson.data || []);
        }
      })
      .catch(() => toast.error("Failed to load data"));
  }, []);

  const buildCategoryHierarchy = (cats: Category[], prods: Product[]) => {
    const categoryMap = new Map<string, CategoryNode>();

    cats.forEach((cat) => {
      categoryMap.set(cat._id, {
        category: cat,
        children: [],
        products: [],
      });
    });

    prods.forEach((prod) => {
      if (prod.category?._id) {
        const node = categoryMap.get(prod.category._id);
        if (node) {
          node.products.push(prod);
        }
      }
    });

    const rootNodes: CategoryNode[] = [];
    categoryMap.forEach((node) => {
      if (node.category.parentId) {
        const parent = categoryMap.get(node.category.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          rootNodes.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    });

    setCategoryHierarchy(rootNodes);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getAllProductsInCategory = (node: CategoryNode): Product[] => {
    const products = [...node.products];
    node.children.forEach((child) => {
      products.push(...getAllProductsInCategory(child));
    });
    return products;
  };

  const toggleAllInCategory = (
    node: CategoryNode,
    list: string[],
    setList: (val: string[]) => void
  ) => {
    const categoryProducts = getAllProductsInCategory(node);
    const categoryProductIds = categoryProducts.map((p) => p._id);
    const allSelected = categoryProductIds.every((id) => list.includes(id));

    if (allSelected) {
      setList(list.filter((id) => !categoryProductIds.includes(id)));
    } else {
      const newList = [...list];
      categoryProductIds.forEach((id) => {
        if (!newList.includes(id)) newList.push(id);
      });
      setList(newList);
    }
  };

  const areAllInCategorySelected = (node: CategoryNode, list: string[]) => {
    const categoryProducts = getAllProductsInCategory(node);
    if (categoryProducts.length === 0) return false;
    return categoryProducts.every((p) => list.includes(p._id));
  };

  const renderCategoryTree = (
    nodes: CategoryNode[],
    list: string[],
    setList: (val: string[]) => void,
    depth = 0
  ): JSX.Element => {
    return (
      <div className={depth > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""}>
        {nodes.map((node) => {
          const isExpanded = expandedCategories.has(node.category._id);
          const hasChildren = node.children.length > 0;
          const hasProducts = node.products.length > 0;
          const allSelected = areAllInCategorySelected(node, list);

          return (
            <div key={node.category._id} className="mb-2">
              <div className="flex items-center gap-2 py-2">
                {(hasChildren || hasProducts) && (
                  <button
                    type="button"
                    onClick={() => toggleCategory(node.category._id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {isExpanded ? "▼" : "▶"}
                  </button>
                )}
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() =>
                    toggleAllInCategory(node, list, setList)
                  }
                />
                <span className="font-semibold text-gray-900">
                  {node.category.name}
                  <span className="text-sm text-gray-500 ml-2">
                    ({getAllProductsInCategory(node).length} products)
                  </span>
                </span>
              </div>

              {isExpanded && (
                <>
                  {hasChildren &&
                    renderCategoryTree(node.children, list, setList, depth + 1)}
                  {hasProducts && (
                    <div className="ml-6 space-y-1">
                      {node.products.map((product) => (
                        <label
                          key={product._id}
                          className="flex items-center gap-2 cursor-pointer text-sm py-1"
                        >
                          <Checkbox
                            checked={list.includes(product._id)}
                            onCheckedChange={() =>
                              toggleProduct(product._id, list, setList)
                            }
                          />
                          <span className="text-gray-700">{product.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (!offerId) return;

    const loadOffer = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/offers/${offerId}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          toast.error(json.message || "Failed to load offer");
          return;
        }

        const offer = json.data;

        setName(offer.name || "");
        setCouponCode(offer.couponCode || "");
        setType(offer.type || "percentage");
        setValue(offer.value || 0);
        setStatus(offer.status || "active");
        setDescription(offer.description || "");
        setTermsAndConditions(offer.termsAndConditions || "");

        if (offer.startDate) {
          const date = new Date(offer.startDate);
          setStartDate(date.toISOString().slice(0, 16));
        }
        if (offer.expiryDate) {
          const date = new Date(offer.expiryDate);
          setExpiryDate(date.toISOString().slice(0, 16));
        }

        setMinCartValue(offer.minCartValue);
        setMaxDiscount(offer.maxDiscount);
        setUsageLimit(offer.usageLimit);
        setPerUserLimit(offer.perUserLimit);

        setApplicableProducts(
          offer.applicableProducts?.map((p: any) => p._id || p) || []
        );
        setExcludedProducts(
          offer.excludedProducts?.map((p: any) => p._id || p) || []
        );

        if (offer.buyXGetY?.enabled) {
          setBuyXGetYEnabled(true);
          setBuyQuantity(offer.buyXGetY.buyQuantity || 1);
          setGetQuantity(offer.buyXGetY.getQuantity || 1);
          setBuyProducts(
            offer.buyXGetY.buyProducts?.map((p: any) => p._id || p) || []
          );
          setGetProducts(
            offer.buyXGetY.getProducts?.map((p: any) => p._id || p) || []
          );
        }
      } catch (error) {
        toast.error("Error loading offer");
      } finally {
        setLoading(false);
      }
    };

    loadOffer();
  }, [offerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !couponCode || !type || value === undefined) {
      toast.error("Please fill in all required fields");
      return;
    }

    const offerData = {
      name,
      couponCode: couponCode.toUpperCase(),
      type,
      value,
      status,
      startDate: startDate || undefined,
      expiryDate: expiryDate || undefined,
      minCartValue,
      maxDiscount,
      applicableProducts:
        applicableProducts.length > 0 ? applicableProducts : undefined,
      excludedProducts:
        excludedProducts.length > 0 ? excludedProducts : undefined,
      buyXGetY: buyXGetYEnabled
        ? {
            enabled: true,
            buyQuantity,
            getQuantity,
            buyProducts: buyProducts.length > 0 ? buyProducts : undefined,
            getProducts: getProducts.length > 0 ? getProducts : undefined,
          }
        : undefined,
      usageLimit,
      perUserLimit,
      description,
      termsAndConditions,
    };

    try {
      const res = await fetch(`/api/admin/offers/${offerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerData),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        toast.success("Offer updated successfully!");
        router.push("/admin/offers");
      } else {
        toast.error(json.message || "Error updating offer");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const toggleProduct = (
    productId: string,
    list: string[],
    setList: (val: string[]) => void
  ) => {
    setList(
      list.includes(productId)
        ? list.filter((id) => id !== productId)
        : [...list, productId]
    );
  };

  if (loading) {
    return <div className="p-6 md:p-10">Loading...</div>;
  }

  return (
    <div className="w-full p-6 md:p-10">
      <Link
        href="/admin/offers"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        {"← Back to Offers"}
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Edit Offer</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" type="button">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="conditions" type="button">
              Conditions
            </TabsTrigger>
            <TabsTrigger value="products" type="button">
              Products
            </TabsTrigger>
            <TabsTrigger value="buyxgety" type="button">
              Buy X Get Y
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="basic"
            className="space-y-4 p-4 border rounded-md mt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Offer Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="couponCode">Coupon Code *</Label>
                <Input
                  id="couponCode"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g., SAVE20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Discount Type *</Label>
                <Select
                  value={type}
                  onValueChange={(val: "percentage" | "amount") => setType(val)}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">
                  Value * {type === "percentage" ? "(0-100%)" : "(₹)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  max={type === "percentage" ? "100" : undefined}
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(val: "active" | "expired" | "scheduled") =>
                    setStatus(val)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date (Optional)</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the offer"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="terms">Terms & Conditions (Optional)</Label>
              <Textarea
                id="terms"
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                placeholder="Terms and conditions for this offer"
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="conditions"
            className="space-y-4 p-4 border rounded-md mt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minCartValue">Minimum Cart Value (₹)</Label>
                <Input
                  id="minCartValue"
                  type="number"
                  min="0"
                  value={minCartValue || ""}
                  onChange={(e) =>
                    setMinCartValue(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="e.g., 1000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Offer applies only if cart value is above this amount
                </p>
              </div>
              <div>
                <Label htmlFor="maxDiscount">Maximum Discount Amount (₹)</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  min="0"
                  value={maxDiscount || ""}
                  onChange={(e) =>
                    setMaxDiscount(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="e.g., 500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum discount amount for percentage-based offers
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="usageLimit">Total Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="0"
                  value={usageLimit || ""}
                  onChange={(e) =>
                    setUsageLimit(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="e.g., 100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum number of times this offer can be used globally
                </p>
              </div>
              <div>
                <Label htmlFor="perUserLimit">Per User Limit</Label>
                <Input
                  id="perUserLimit"
                  type="number"
                  min="0"
                  value={perUserLimit || ""}
                  onChange={(e) =>
                    setPerUserLimit(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="e.g., 1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum number of times a single user can use this offer
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="products"
            className="space-y-4 p-4 border rounded-md mt-4"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-semibold">
                  Applicable Products (Optional)
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setExpandedCategories(new Set(categories.map((c) => c._id)))
                  }
                  className="text-sm"
                >
                  Expand All
                </Button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Select specific products this offer applies to. Leave empty to
                apply to all products.
              </p>
              <div className="border rounded-md p-4 max-h-96 overflow-y-auto bg-white">
                {categoryHierarchy.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No categories or products available
                  </p>
                ) : (
                  renderCategoryTree(
                    categoryHierarchy,
                    applicableProducts,
                    setApplicableProducts
                  )
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-semibold">
                  Excluded Products (Optional)
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setExpandedCategories(new Set(categories.map((c) => c._id)))
                  }
                  className="text-sm"
                >
                  Expand All
                </Button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Select products to exclude from this offer.
              </p>
              <div className="border rounded-md p-4 max-h-96 overflow-y-auto bg-white">
                {categoryHierarchy.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No categories or products available
                  </p>
                ) : (
                  renderCategoryTree(
                    categoryHierarchy,
                    excludedProducts,
                    setExcludedProducts
                  )
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="buyxgety"
            className="space-y-4 p-4 border rounded-md mt-4"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={buyXGetYEnabled}
                onCheckedChange={(checked) => setBuyXGetYEnabled(!!checked)}
              />
              <Label>Enable Buy X Get Y Offer</Label>
            </div>

            {buyXGetYEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buyQuantity">Buy Quantity</Label>
                    <Input
                      id="buyQuantity"
                      type="number"
                      min="1"
                      value={buyQuantity}
                      onChange={(e) => setBuyQuantity(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="getQuantity">Get Quantity (Free)</Label>
                    <Input
                      id="getQuantity"
                      type="number"
                      min="1"
                      value={getQuantity}
                      onChange={(e) => setGetQuantity(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Buy Products (Optional)</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    Select specific products to buy. Leave empty to allow any
                    product.
                  </p>
                  <div className="border rounded-md p-4 max-h-64 overflow-y-auto bg-white">
                    {products.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No products available
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {products.map((product) => (
                          <label
                            key={product._id}
                            className="flex items-center gap-2 cursor-pointer text-sm"
                          >
                            <Checkbox
                              checked={buyProducts.includes(product._id)}
                              onCheckedChange={() =>
                                toggleProduct(
                                  product._id,
                                  buyProducts,
                                  setBuyProducts
                                )
                              }
                            />
                            {product.name}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Get Products (Optional)</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    Select products user can get for free. Leave empty to allow
                    any product.
                  </p>
                  <div className="border rounded-md p-4 max-h-64 overflow-y-auto bg-white">
                    {products.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No products available
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {products.map((product) => (
                          <label
                            key={product._id}
                            className="flex items-center gap-2 cursor-pointer text-sm"
                          >
                            <Checkbox
                              checked={getProducts.includes(product._id)}
                              onCheckedChange={() =>
                                toggleProduct(
                                  product._id,
                                  getProducts,
                                  setGetProducts
                                )
                              }
                            />
                            {product.name}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        <Button
          type="submit"
          className="bg-orange-500 text-white hover:bg-orange-600 w-full md:w-auto"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
}
