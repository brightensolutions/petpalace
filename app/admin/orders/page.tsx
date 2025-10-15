"use client";

import { useEffect, useMemo, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantLabel?: string;
};

type OrderAddress = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
};

type Order = {
  _id: string;
  userId?: string;
  orderNumber?: string;
  items: OrderItem[];
  address: OrderAddress;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: "cod" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  couponCode?: string;
  notes?: string;
  pets?: Array<{
    name?: string;
    breed?: string;
    age?: number;
    gender?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  user?: any;
};

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editPaymentStatus, setEditPaymentStatus] =
    useState<Order["paymentStatus"]>("pending");
  const [editOrderStatus, setEditOrderStatus] =
    useState<Order["orderStatus"]>("pending");
  const [editNotes, setEditNotes] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "/api/admin/orders?q=" + encodeURIComponent(searchTerm || ""),
          { cache: "no-store" }
        );
        console.log(
          "[v0] fetch /api/admin/orders status:",
          res.status,
          "ok:",
          res.ok
        );

        const raw = await res.text();
        console.log("[v0] fetch /api/admin/orders body:", raw?.slice(0, 500));

        if (!res.ok) {
          toast.error(`Failed to fetch orders (${res.status})`);
          return;
        }

        let json: any = null;
        try {
          json = raw ? JSON.parse(raw) : null;
        } catch (e: any) {
          console.error("[v0] parse /api/admin/orders JSON error:", e?.message);
        }

        let data: Order[] = [];
        if (Array.isArray(json)) data = json;
        else if (Array.isArray(json?.data)) data = json.data;
        else if (Array.isArray(json?.orders)) data = json.orders;
        else if (Array.isArray(json?.data?.orders)) data = json.data.orders;
        else if (Array.isArray(json?.docs)) data = json.docs;
        else if (Array.isArray(json?.data?.docs)) data = json.data.docs;

        console.log(
          "[v0] orders parsed count:",
          Array.isArray(data) ? data.length : "not array"
        );
        setOrders(data || []);
      } catch (err: any) {
        console.error("[v0] fetch /api/admin/orders error:", err?.message, err);
        toast.error("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [searchTerm]);

  const filteredOrders = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return orders;
    return orders.filter((o) => {
      const customer = o.address?.name || "";
      const phone = o.address?.phone || "";
      const email = o.address?.email || "";
      const userId = o.userId || "";
      const user: any = (o as any).user || {};
      const userName = user?.name || "";
      const userEmail = user?.email || "";
      return (
        (o.orderNumber || "").toLowerCase().includes(s) ||
        customer.toLowerCase().includes(s) ||
        phone.toLowerCase().includes(s) ||
        email.toLowerCase().includes(s) ||
        userId.toLowerCase().includes(s) ||
        userName.toLowerCase().includes(s) ||
        userEmail.toLowerCase().includes(s) ||
        o.paymentStatus.toLowerCase().includes(s) ||
        o.orderStatus.toLowerCase().includes(s)
      );
    });
  }, [orders, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (dir: "prev" | "next") => {
    if (dir === "prev" && currentPage > 1) {
      setCurrentPage((p) => p - 1);
    } else if (dir === "next" && currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const openEditDialog = (order: Order) => {
    setSelectedOrder(order);
    setEditPaymentStatus(order.paymentStatus);
    setEditOrderStatus(order.orderStatus);
    setEditNotes(order.notes || "");
    setOpen(true);
  };

  const saveEdits = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: editPaymentStatus,
          orderStatus: editOrderStatus,
          notes: editNotes,
        }),
      });
      const rawPut = await res.text();
      console.log(
        "[v0] PUT /api/admin/orders/:id status:",
        res.status,
        "ok:",
        res.ok,
        "body:",
        rawPut.slice(0, 500)
      );
      if (!res.ok) {
        let errJson: any = {};
        try {
          errJson = rawPut ? JSON.parse(rawPut) : {};
        } catch {}
        throw new Error(errJson?.error || "Failed to update order");
      }
      let jsonPut: any = {};
      try {
        jsonPut = rawPut ? JSON.parse(rawPut) : {};
      } catch {}
      const updated: Order = jsonPut?.data || jsonPut?.order || jsonPut;

      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? { ...o, ...updated } : o))
      );
      toast.success("Order updated");
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      const rawDel = await res.text();
      console.log(
        "[v0] DELETE /api/admin/orders/:id status:",
        res.status,
        "ok:",
        res.ok,
        "body:",
        rawDel.slice(0, 500)
      );
      if (!res.ok) {
        let errJson: any = {};
        try {
          errJson = rawDel ? JSON.parse(rawDel) : {};
        } catch {}
        throw new Error(errJson?.error || "Failed to delete order");
      }
      setOrders((prev) => prev.filter((o) => o._id !== id));
      toast.success("Order deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    }
  };

  const currency = (n: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "INR",
    }).format(n);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
        <div className="grid gap-1 pt-6">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Orders
          </CardTitle>
          <CardDescription className="text-gray-500">
            Review, edit, and manage orders.
          </CardDescription>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search orders (number, customer, phone, email, userId, status)..."
            className="sm:w-72"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Select
            value={String(rowsPerPage)}
            onValueChange={(val) => {
              setRowsPerPage(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-6 text-center text-gray-500"
                  >
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((o) => (
                  <TableRow key={o._id}>
                    <TableCell className="font-semibold text-gray-800">
                      {o.orderNumber || o._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {o.address?.name || "-"}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {o.address?.phone || "-"}
                    </TableCell>
                    <TableCell className="text-gray-800">
                      {currency(o.total)}
                    </TableCell>
                    <TableCell className="text-gray-700 capitalize">
                      {o.paymentStatus}
                    </TableCell>
                    <TableCell className="text-gray-700 capitalize">
                      {o.orderStatus}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Open actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(o)}>
                            View / Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(o._id)}
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
                    colSpan={8}
                    className="py-6 text-center text-gray-500"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
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

      {/* View/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl lg:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Order{" "}
              {selectedOrder?.orderNumber ||
                selectedOrder?._id?.slice(-8).toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              View details and update statuses.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid gap-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded border p-3">
                  <h4 className="font-medium mb-2">Customer</h4>
                  <p className="text-sm text-gray-700">
                    {selectedOrder.address?.name} •{" "}
                    {selectedOrder.address?.phone}
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedOrder.address?.email}
                  </p>
                  <p className="text-sm text-gray-600 break-words">
                    {selectedOrder.address?.address},{" "}
                    {selectedOrder.address?.city},{" "}
                    {selectedOrder.address?.state}{" "}
                    {selectedOrder.address?.pincode}
                  </p>
                  {/* User object, if the API populates it */}
                  {Boolean((selectedOrder as any)?.user) && (
                    <div className="mt-2 border-t pt-2">
                      <p className="text-sm text-gray-700">
                        User: {(selectedOrder as any).user?.name || "-"} •{" "}
                        {(selectedOrder as any).user?.email || "-"}
                      </p>
                      <p className="text-sm text-gray-700 break-all">
                        User ID:{" "}
                        {(selectedOrder as any).user?._id ||
                          selectedOrder.userId ||
                          "-"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="rounded border p-3">
                  <h4 className="font-medium mb-2">Order Meta</h4>
                  <p className="text-sm text-gray-700 break-all">
                    User ID: {selectedOrder.userId || "-"}
                  </p>
                  <p className="text-sm text-gray-700">
                    Created:{" "}
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString()
                      : "-"}
                  </p>
                  <p className="text-sm text-gray-700">
                    Updated:{" "}
                    {selectedOrder.updatedAt
                      ? new Date(selectedOrder.updatedAt).toLocaleString()
                      : "-"}
                  </p>
                  <div className="mt-2 border-t pt-2">
                    <p className="text-sm text-gray-700 capitalize">
                      Payment: {selectedOrder.paymentMethod}
                    </p>
                    <p className="text-sm text-gray-700">
                      Subtotal: {currency(selectedOrder.subtotal)}
                    </p>
                    <p className="text-sm text-gray-700">
                      Delivery: {currency(selectedOrder.deliveryFee)}
                    </p>
                    <p className="text-sm text-gray-700">
                      Discount: {currency(selectedOrder.discount)}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      Total: {currency(selectedOrder.total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pets (optional) */}
              {Array.isArray(selectedOrder.pets) &&
                selectedOrder.pets.length > 0 && (
                  <div className="rounded border">
                    <div className="p-3 border-b">
                      <h4 className="font-medium">Pets</h4>
                    </div>
                    <div className="p-3 overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[100px]">
                              Name
                            </TableHead>
                            <TableHead className="min-w-[100px]">
                              Breed
                            </TableHead>
                            <TableHead className="min-w-[60px]">Age</TableHead>
                            <TableHead className="min-w-[80px]">
                              Gender
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.pets.map((pet, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="text-gray-800">
                                {(pet as any)?.name || "-"}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {(pet as any)?.breed || "-"}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {(pet as any)?.age ?? "-"}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {(pet as any)?.gender || "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

              {/* Items */}
              <div className="rounded border">
                <div className="p-3 border-b">
                  <h4 className="font-medium">Items</h4>
                </div>
                <div className="p-3 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Item</TableHead>
                        <TableHead className="min-w-[100px]">Variant</TableHead>
                        <TableHead className="min-w-[60px]">Qty</TableHead>
                        <TableHead className="min-w-[100px]">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((it, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-gray-800">
                            {it.name}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {it.variantLabel || "-"}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {it.quantity}
                          </TableCell>
                          <TableCell className="text-gray-800">
                            {currency(it.price)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Editable fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={editPaymentStatus}
                    onValueChange={(v: Order["paymentStatus"]) =>
                      setEditPaymentStatus(v)
                    }
                  >
                    <SelectTrigger id="paymentStatus">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="orderStatus">Order Status</Label>
                  <Select
                    value={editOrderStatus}
                    onValueChange={(v: Order["orderStatus"]) =>
                      setEditOrderStatus(v)
                    }
                  >
                    <SelectTrigger id="orderStatus">
                      <SelectValue placeholder="Select order status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={4}
                />
              </div>

              <DialogFooter className="gap-2 flex-col sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                  onClick={saveEdits}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
