"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, User, Package } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CartItemProduct {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
  brand?: string;
  variantLabel?: string;
  _id: string;
}

interface CartResponse {
  id?: string;
  _id?: string;
  userId: string | { _id: string; name?: string; email?: string };
  items: CartItemProduct[];
  createdAt: string;
  updatedAt: string;
}

interface FlattenedCartItem {
  cartId: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  productImage?: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export default function AdminCartsPage() {
  const router = useRouter();
  const [carts, setCarts] = useState<FlattenedCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCarts();
  }, [page, search]);

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/carts?page=${page}&limit=20&search=${search}`
      );
      const data = await response.json();

      console.log("[v0] Raw Cart API Response:", JSON.stringify(data, null, 2));
      console.log("[v0] Is data an array?", Array.isArray(data));
      console.log("[v0] Does data have items?", data.items);
      console.log("[v0] Data keys:", Object.keys(data));

      let cartItems: any[] = [];

      if (Array.isArray(data)) {
        cartItems = data;
      } else if (data.items && Array.isArray(data.items)) {
        cartItems = data.items;
      }

      // Map to ensure all required fields and calculate totalPrice
      const processedItems: FlattenedCartItem[] = cartItems.map(
        (item: any) => ({
          cartId: item.cartId || item._id || "",
          userId: item.userId || "",
          userName: item.userName || "Unknown User",
          userEmail: item.userEmail || "",
          productId: item.productId || "",
          productName: item.productName || "Unknown Product",
          productImage: item.productImage || item.image,
          productPrice: item.price || 0,
          quantity: item.quantity || 0,
          totalPrice: (item.price || 0) * (item.quantity || 0),
          createdAt: item.addedAt || item.createdAt || new Date().toISOString(),
        })
      );

      setCarts(processedItems);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || processedItems.length);
    } catch (error) {
      console.error("Error fetching carts:", error);
      toast.error("Error loading cart data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
        <div className="grid gap-1 pt-6">
          <CardTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-green-600" />
            Carts
          </CardTitle>
          <CardDescription className="text-gray-500">
            View all user carts ({total} items)
          </CardDescription>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by user or product..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Added On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-6"
                  >
                    Loading cart items...
                  </TableCell>
                </TableRow>
              ) : carts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-6"
                  >
                    <ShoppingCart className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    No cart items found.
                  </TableCell>
                </TableRow>
              ) : (
                carts.map((item, index) => (
                  <TableRow key={`${item.cartId}-${item.productId}-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.productImage ? (
                          <Image
                            src={item.productImage || "/placeholder.svg"}
                            alt={item.productName}
                            width={48}
                            height={48}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {item.productId.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.userName}
                          </p>
                          {item.userEmail && (
                            <p className="text-sm text-gray-500">
                              {item.userEmail}
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            ID: {item.userId.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-800 font-medium">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-800">
                      ₹{item.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
