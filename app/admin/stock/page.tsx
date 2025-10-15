"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  File,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

interface Pack {
  label: string;
  price: number;
  stock: number;
  sku?: string;
}

interface Variant {
  _id: string;
  type: string;
  label: string;
  price?: number;
  stock: number;
  packs?: Pack[];
  sku?: string;
}

interface Product {
  _id: string;
  name: string;
  main_image?: string;
  brand?: { _id: string; name: string };
  category?: { _id: string; name: string };
  stock: number;
  variants: Variant[];
  sku?: string;
}

interface Category {
  _id: string;
  name: string;
  parentId?: string;
}

interface FilterOptions {
  categories: Category[];
  brands: { _id: string; name: string }[];
}

export default function StockManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    brands: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<{
    variantId: string;
    packIndex?: number;
    value: number;
  } | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedBrand) params.append("brand", selectedBrand);

      const res = await fetch(`/api/admin/stock?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setProducts(json.data);
        if (json.filters) {
          setFilters(json.filters);
        }
      } else {
        toast.error("Failed to load stock data");
      }
    } catch (error) {
      console.error("[v0] Error fetching stock:", error);
      toast.error("Error fetching stock data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, selectedBrand]);

  const handleStockUpdate = async (
    variantId: string,
    stock: number,
    packIndex?: number
  ) => {
    try {
      const res = await fetch("/api/admin/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stock, packIndex }),
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Stock updated successfully");
        fetchProducts();
        setEditingStock(null);
      } else {
        toast.error(json.message || "Failed to update stock");
      }
    } catch (error) {
      console.error("[v0] Error updating stock:", error);
      toast.error("Error updating stock");
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock < 10) {
      return <Badge className="bg-orange-500">Low Stock</Badge>;
    } else {
      return <Badge className="bg-green-500">In Stock</Badge>;
    }
  };

  const totalPages = Math.ceil(products.length / rowsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (dir: "prev" | "next") => {
    if (dir === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (dir === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleExport = async (format: "excel" | "csv" | "pdf") => {
    try {
      toast.info(`Preparing ${format.toUpperCase()} export...`);

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedBrand) params.append("brand", selectedBrand);
      params.append("format", format);

      const res = await fetch(`/api/admin/stock/export?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Export failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const timestamp = new Date().toISOString().split("T")[0];
      const extension = format === "excel" ? "xlsx" : format;
      a.download = `stock-report-${timestamp}.${extension}`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`${format.toUpperCase()} exported successfully`);
    } catch (error) {
      console.error("[v0] Export error:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4">
          <div className="grid gap-1 pt-6">
            <CardTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <Package className="h-6 w-6" />
              Stock Management
            </CardTitle>
            <CardDescription className="text-gray-500">
              Manage product variants and stock levels
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <File className="h-4 w-4 mr-2 text-blue-600" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileText className="h-4 w-4 mr-2 text-red-600" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Select
              value={String(rowsPerPage)}
              onValueChange={(val) => {
                setRowsPerPage(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20 rows</SelectItem>
                <SelectItem value="40">40 rows</SelectItem>
                <SelectItem value="60">60 rows</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={(val) => {
                setSelectedCategory(val === "all" ? "" : val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {filters.categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedBrand}
              onValueChange={(val) => {
                setSelectedBrand(val === "all" ? "" : val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {filters.brands.map((brand) => (
                  <SelectItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedBrand("");
                setCurrentPage(1);
              }}
              size="sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <React.Fragment key={product._id}>
                      <TableRow className="bg-gray-50">
                        <TableCell>
                          <img
                            src={
                              product.main_image ||
                              "/placeholder.svg?height=50&width=50"
                            }
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          {product.name}
                          {product.sku && (
                            <div className="text-xs text-gray-500">
                              SKU: {product.sku}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{product.brand?.name || "N/A"}</TableCell>
                        <TableCell>{product.category?.name || "N/A"}</TableCell>
                        <TableCell className="text-gray-500">
                          Base Product
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStockBadge(product.stock)}
                            <span className="text-sm">{product.stock}</span>
                          </div>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>

                      {product.variants.map((variant) => (
                        <React.Fragment key={variant._id}>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell className="pl-8 text-sm text-gray-600">
                              └ {variant.label}
                              {variant.sku && (
                                <div className="text-xs text-gray-400">
                                  SKU: {variant.sku}
                                </div>
                              )}
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <Badge variant="outline">{variant.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {editingStock?.variantId === variant._id &&
                                editingStock.packIndex === undefined ? (
                                  <Input
                                    type="number"
                                    min="0"
                                    value={editingStock.value}
                                    onChange={(e) =>
                                      setEditingStock({
                                        ...editingStock,
                                        value: Number(e.target.value),
                                      })
                                    }
                                    className="w-20 h-8"
                                    autoFocus
                                  />
                                ) : (
                                  <span className="text-sm">
                                    {variant.stock}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {editingStock?.variantId === variant._id &&
                              editingStock.packIndex === undefined ? (
                                <div className="flex gap-1 justify-end">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleStockUpdate(
                                        variant._id,
                                        editingStock.value
                                      )
                                    }
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingStock(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setEditingStock({
                                      variantId: variant._id,
                                      value: variant.stock,
                                    })
                                  }
                                >
                                  Edit
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>

                          {variant.packs &&
                            variant.packs.map((pack, packIndex) => (
                              <TableRow
                                key={`${variant._id}-pack-${packIndex}`}
                              >
                                <TableCell></TableCell>
                                <TableCell className="pl-16 text-sm text-gray-500">
                                  └ {pack.label}
                                  {pack.sku && (
                                    <div className="text-xs text-gray-400">
                                      SKU: {pack.sku}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50"
                                  >
                                    Pack
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {getStockBadge(pack.stock)}
                                    {editingStock?.variantId === variant._id &&
                                    editingStock.packIndex === packIndex ? (
                                      <Input
                                        type="number"
                                        min="0"
                                        value={editingStock.value}
                                        onChange={(e) =>
                                          setEditingStock({
                                            ...editingStock,
                                            value: Number(e.target.value),
                                          })
                                        }
                                        className="w-20 h-8"
                                        autoFocus
                                      />
                                    ) : (
                                      <span className="text-sm">
                                        {pack.stock}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {editingStock?.variantId === variant._id &&
                                  editingStock.packIndex === packIndex ? (
                                    <div className="flex gap-1 justify-end">
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleStockUpdate(
                                            variant._id,
                                            editingStock.value,
                                            packIndex
                                          )
                                        }
                                        className="bg-green-500 hover:bg-green-600"
                                      >
                                        Save
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingStock(null)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        setEditingStock({
                                          variantId: variant._id,
                                          packIndex,
                                          value: pack.stock,
                                        })
                                      }
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-500 py-8"
                    >
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages || 1} ({products.length} total
              products)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange("prev")}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => handlePageChange("next")}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
