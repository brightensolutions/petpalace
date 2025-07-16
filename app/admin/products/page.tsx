"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface Product {
  _id: string;
  id: number;
  name: string;
  slug: string;
  price: number;
  category_id: {
    _id: string;
    name: string;
  };
  brand_id: {
    _id: string;
    name: string;
  };
  images?: string[];
}

export default function ManageProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        } else {
          toast.error("Failed to fetch products");
        }
      } catch (error) {
        toast.error("Error loading products");
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success("Product deleted");
      } else {
        toast.error("Failed to delete product");
      }
    } catch {
      toast.error("Server error while deleting");
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
        <div className="grid gap-1 pt-6">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Products
          </CardTitle>
          <CardDescription className="text-gray-500">
            Manage your products, including categories and brands.
          </CardDescription>
        </div>
        <Button
          size="sm"
          className="h-8 gap-1 bg-orange-500 text-white hover:bg-orange-600"
          onClick={() => router.push("/admin/products/add")}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Product
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[64px] hidden sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.name}
                        src={product.images?.[0] || "/placeholder.svg"}
                        width={64}
                        height={64}
                        className="rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category_id?.name || "-"}</TableCell>
                    <TableCell>{product.brand_id?.name || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      ₹{product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/admin/products/${product._id}`)
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
