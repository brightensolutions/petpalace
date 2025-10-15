"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AddressModal } from "@/components/address-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { addToCart as addToCartService } from "@/lib/services/cart-service";
import {
  UserCog,
  MapPin,
  PackageCheck,
  Coins,
  Heart,
  PhoneCall,
  LogOut,
  Edit,
  Plus,
  Eye,
  Star,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Package,
} from "lucide-react";
import Image from "next/image";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantLabel?: string;
  foodType?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  pets?: any[];
  address: any;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  trackingId?: string;
}

interface WishlistItem {
  _id: string;
  name: string;
  category?: string;
  price: number;
  image: string;
}

interface Address {
  _id?: string;
  name: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  label: string;
  isDefault: boolean;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  number?: string;
  avatar?: string;
  totalOrders?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
  walletBalance?: number;
  addresses: Address[];
}

function isJsonResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  return contentType.includes("application/json");
}

async function safeFetchJSON<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });
  if (!isJsonResponse(res)) {
    const snippet = await res
      .text()
      .then((t) => t.slice(0, 160))
      .catch(() => "");
    throw new Error(
      `[${res.status}] Non-JSON response from ${
        typeof input === "string" ? input : "request"
      }: ${snippet}`
    );
  }
  const data = await res.json();
  if (!res.ok) {
    const message = (data as any)?.error || res.statusText;
    throw new Error(`[${res.status}] ${message}`);
  }
  return data as T;
}

export default function UserDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await safeFetchJSON<{
          authenticated: boolean;
          user: UserData;
        }>("/api/users/me");
        if (data.authenticated) {
          setUser({ ...data.user, addresses: data.user.addresses || [] });
        } else {
          console.warn("User not authenticated. Redirecting to sign-in.");
        }
      } catch (error) {
        console.error(
          "Failed to fetch user (safe):",
          (error as Error)?.message
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const data = await safeFetchJSON<{ orders: Order[] }>(
          "/api/users/orders"
        );
        if (data.orders) {
          // Keep full order data for details view
          setOrders(data.orders as Order[]);
        }
      } catch (error) {
        console.error(
          "Failed to fetch orders (safe):",
          (error as Error)?.message
        );
      }
    };

    const fetchWishlist = async () => {
      try {
        console.log("[v0][dashboard] fetching /api/users/wishlist");
        const raw = await safeFetchJSON<any>("/api/users/wishlist");
        const arr: any[] = raw?.wishlist ?? raw?.items ?? raw ?? [];
        console.log(
          "[v0][dashboard] wishlist raw keys:",
          Object.keys(raw || {})
        );
        console.log(
          "[v0][dashboard] wishlist array length:",
          Array.isArray(arr) ? arr.length : -1
        );
        if (arr[0]) {
          console.log(
            "[v0][dashboard] wishlist sample item keys:",
            Object.keys(arr[0] || {})
          );
          console.log("[v0][dashboard] wishlist sample item preview:", {
            productId: arr[0]?.productId,
            name: arr[0]?.name,
            price: arr[0]?.price,
            image: String(arr[0]?.image || "").slice(0, 120),
          });
        }

        const normalized: WishlistItem[] = arr.map((item: any, idx: number) => {
          const productObj =
            item?.product ||
            (item?.productId && typeof item.productId === "object"
              ? item.productId
              : null) ||
            item?.productRef ||
            null;

          const pid =
            (productObj &&
              (productObj._id || productObj.id || productObj.productId)) ||
            item?.productId ||
            item?._id;

          const name =
            productObj?.name ||
            item?.name ||
            `Product ${String(pid ?? "")
              .toString()
              .slice(-6)}`;
          const image =
            productObj?.image ||
            (Array.isArray(productObj?.images)
              ? productObj.images[0]
              : undefined) ||
            item?.image ||
            "/wishlist-product.jpg";
          const priceRaw = productObj?.price ?? item?.price ?? 0;
          const price = Number.isFinite(Number(priceRaw))
            ? Number(priceRaw)
            : 0;
          const category =
            productObj?.category?.name ||
            productObj?.category ||
            item?.category ||
            "Product";

          if (idx === 0) {
            console.log("[v0][dashboard] normalized sample:", {
              _id: String(pid ?? item?._id ?? ""),
              name,
              price,
              image: String(image || "").slice(0, 120),
              category,
            });
          }

          return {
            _id: String(pid ?? item?._id ?? Date.now()),
            name,
            category,
            price,
            image,
          };
        });

        console.log("[v0][dashboard] normalized length:", normalized.length);
        setWishlistItems(normalized);
      } catch (err) {
        console.error(
          "[v0][dashboard] Failed to fetch wishlist (safe):",
          (err as Error)?.message
        );
        setWishlistItems([]);
      }
    };

    fetchUser();
    fetchOrders();
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Please log in to view your dashboard.</p>
        <Button onClick={() => (window.location.href = "/sign-in")}>
          Go to Login
        </Button>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAddressSave = (savedAddress: Address) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      let updatedAddresses: Address[];
      const existingAddressIndex = prevUser.addresses.findIndex(
        (addr) => addr._id === savedAddress._id
      );

      if (existingAddressIndex !== -1) {
        updatedAddresses = prevUser.addresses.map((addr, index) =>
          index === existingAddressIndex ? savedAddress : addr
        );
      } else {
        updatedAddresses = [...prevUser.addresses, savedAddress];
      }

      if (savedAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: addr._id === savedAddress._id,
        }));
      }

      return { ...prevUser, addresses: updatedAddresses };
    });
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`/api/users/addresses/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ addressId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            addresses: prevUser.addresses.filter(
              (addr) => addr._id !== addressId
            ),
          };
        });
      } else {
        alert(data.error || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Error deleting address");
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/users/addresses/set-default`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ addressId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUser((prevUser) => {
          if (!prevUser) return null;
          const updatedAddresses = prevUser.addresses.map((addr) => ({
            ...addr,
            isDefault: addr._id === addressId,
          }));
          return { ...prevUser, addresses: updatedAddresses };
        });
      } else {
        alert(data.error || "Failed to set default address");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      alert("Error setting default address");
    }
  };

  const sidebarItems = [
    { id: "profile", label: "My Profile", icon: UserCog },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "orders", label: "My Orders", icon: PackageCheck },
    { id: "wallet", label: "My Petpalace Points", icon: Coins },
    { id: "wishlist", label: "My Wishlist", icon: Heart },
    { id: "contact", label: "Contact Us", icon: PhoneCall },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "orders":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Orders</h2>
            </div>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order._id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <Image
                          src={
                            order.items?.[0]?.image ||
                            "/placeholder.svg?height=80&width=80&query=order+thumbnail"
                          }
                          alt="Order"
                          width={80}
                          height={80}
                          className="rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-bold text-lg">
                              #{order.orderNumber}
                            </span>
                            <Badge
                              className={getStatusColor(order.orderStatus)}
                            >
                              {getStatusIcon(order.orderStatus)}
                              <span className="ml-1 capitalize">
                                {order.orderStatus}
                              </span>
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-1">
                            Order Date:{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600 mb-2">
                            {order.items?.length || 0} items
                          </p>
                          {order.trackingId && (
                            <p className="text-sm text-blue-600">
                              Tracking ID: {order.trackingId}
                            </p>
                          )}
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-2xl font-bold mb-2">
                            ₹{order.total}
                          </p>
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-transparent"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            {order.orderStatus === "delivered" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent"
                              >
                                <Star className="w-4 h-4 mr-1" />
                                Rate & Review
                              </Button>
                            )}
                            {order.orderStatus === "shipped" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent"
                              >
                                <Truck className="w-4 h-4 mr-1" />
                                Track Order
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Start Shopping
                </Button>
              </div>
            )}
          </div>
        );

      case "wishlist":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Wishlist</h2>
            </div>

            {wishlistItems?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item._id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={
                            item.image ||
                            "/placeholder.svg?height=96&width=96&query=wishlist+product"
                          }
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.category || "Product"}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="font-bold text-orange-600">
                              ₹{item.price}
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddWishlistToCart(item)}
                              className="bg-transparent"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Your wishlist is empty.</p>
              </div>
            )}
          </div>
        );

      case "addresses":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manage Addresses</h2>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  setEditingAddress(null);
                  setShowAddressModal(true);
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add New Address
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(user.addresses || []).map((address: Address, index: number) => (
                <Card
                  key={address._id || index}
                  className={address.isDefault ? "ring-2 ring-orange-500" : ""}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold capitalize">
                          {address.label || "Address"}
                        </span>
                        {address.isDefault && (
                          <Badge className="bg-orange-100 text-orange-800">
                            Default
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingAddress(address);
                          setShowAddressModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-1 text-sm text-gray-700">
                      {address.name && (
                        <p className="font-semibold">{address.name}</p>
                      )}
                      {address.company && <p>{address.company}</p>}
                      {address.address && <p>{address.address}</p>}
                      <p>
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p>{address.country}</p>
                      {address.phone && (
                        <p className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {address.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefaultAddress(address._id!)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleDeleteAddress(address._id!)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "wallet":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Petpalace Points</h2>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-orange-100">Your Petpalace Points</p>
                    <p className="text-3xl font-bold">
                      {user.loyaltyPoints || 0}
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-white/20">
                  Redeem Points
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Mobile Number</p>
                  <p className="text-base font-medium">
                    {user?.number || "Not available"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-base font-medium">
                    {user?.email || "Not provided"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Address Book</h3>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("addresses")}
                  className="mt-4"
                >
                  View Addresses
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "contact":
        return (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Contact Information</h2>
                <p className="text-gray-600">
                  Take a minute to see the FAQ section below. We hope it will
                  answer some of your common queries. In case you still haven't
                  found your answer, here's how you can contact us:
                </p>
                <div className="space-y-2 text-sm text-gray-800">
                  <p>
                    <strong>Call us at:</strong> 011-40845122
                  </p>
                  <p>
                    <strong>Working Hours:</strong> Monday–Saturday, 9am to 9pm
                  </p>
                  <p>
                    <strong>For Support and Queries:</strong>{" "}
                    <a
                      href="mailto:hello@petpalace.com"
                      className="text-blue-600 underline"
                    >
                      hello@petpalace.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Send us a Message</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    ></textarea>
                  </div>
                  <div className="text-right">
                    <Button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  async function handleCancelOrder(orderId: string) {
    if (!orderId) return;
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setIsCanceling(true);
      const res = await fetch("/api/users/orders/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ orderId }),
      });

      let data: any = null;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        data = await res.json().catch(() => null);
      }

      if (!res.ok) {
        throw new Error(data?.error || `Cancel failed (${res.status})`);
      }

      // optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: "cancelled" } : o
        )
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, orderStatus: "cancelled" } : prev
      );
      alert("Order cancelled successfully.");
    } catch (e) {
      console.error("Cancel order error:", e);
      alert((e as Error).message || "Failed to cancel order.");
    } finally {
      setIsCanceling(false);
    }
  }

  const handleAddWishlistToCart = async (item: WishlistItem) => {
    try {
      await addToCartService({
        productId: item._id,
        variantId: undefined,
        packId: undefined,
        quantity: 1,
        price: item.price,
        name: item.name,
        image: item.image,
        brand: "",
        variantLabel: "",
        sku: undefined,
        foodType: undefined,
      });

      toast.success("Added to Cart", {
        description: `${item.name} has been added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error", {
        description: "Failed to add item to cart. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-orange-100 text-orange-600 flex items-center justify-center">
                        {user.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-semibold">Welcome Back!</p>
                      <p className="text-base text-gray-600">
                        Good to See You Again
                      </p>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-3">
                    {sidebarItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={
                          activeSection === item.id ? "default" : "ghost"
                        }
                        className={`w-full justify-start text-lg font-medium px-4 py-2 rounded-lg transition-colors ${
                          activeSection === item.id
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <item.icon
                          className={`w-5 h-5 mr-3 ${
                            activeSection === item.id
                              ? "text-white"
                              : "text-orange-500"
                          }`}
                        />
                        {item.label}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-lg text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5 mr-3 text-red-600" />
                      Logout
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">{renderContent()}</div>
          </div>
        </div>
      </div>
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        onSave={handleAddressSave}
        initialAddress={editingAddress}
      />
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedOrder
                ? `Order #${selectedOrder.orderNumber}`
                : "Order Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder
                ? `Placed on ${new Date(
                    selectedOrder.createdAt
                  ).toLocaleString()}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-2">
                <div
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded ${getStatusColor(
                    selectedOrder.orderStatus
                  )}`}
                >
                  {getStatusIcon(selectedOrder.orderStatus)}
                  <span className="capitalize">
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const msg = encodeURIComponent(
                      `Hi, I need help with order #${selectedOrder.orderNumber}.`
                    );
                    window.open(
                      `https://wa.me/?text=${msg}`,
                      "_blank",
                      "noopener"
                    );
                  }}
                  className="w-full sm:w-auto bg-transparent"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  WhatsApp Support
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelOrder(selectedOrder._id)}
                  disabled={
                    isCanceling ||
                    selectedOrder.orderStatus === "cancelled" ||
                    selectedOrder.orderStatus === "delivered" ||
                    selectedOrder.orderStatus === "shipped"
                  }
                  className="w-full sm:w-auto"
                >
                  {isCanceling ? "Cancelling..." : "Cancel Order"}
                </Button>
              </div>
            </div>
          )}

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <p className="font-medium capitalize">
                    {selectedOrder.paymentMethod} •{" "}
                    {selectedOrder.paymentStatus}
                  </p>
                </div>
                {selectedOrder.trackingId && (
                  <div className="md:text-right">
                    <p className="text-sm text-gray-500">Tracking</p>
                    <p className="font-medium">{selectedOrder.trackingId}</p>
                  </div>
                )}
              </div>

              <div className="rounded-md border">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 border-b last:border-b-0"
                  >
                    <img
                      src={
                        item.image ||
                        "/placeholder.svg?height=64&width=64&query=order+item"
                      }
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                        {item.variantLabel ? ` • ${item.variantLabel}` : ""}
                        {item.foodType ? ` • ${item.foodType}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                  <div className="text-sm text-gray-700">
                    <p className="font-medium">{selectedOrder.address?.name}</p>
                    <p>{selectedOrder.address?.address}</p>
                    <p>
                      {selectedOrder.address?.city},{" "}
                      {selectedOrder.address?.state} -{" "}
                      {selectedOrder.address?.pincode}
                    </p>
                    <p>{selectedOrder.address?.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Summary</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹{selectedOrder.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>-₹{selectedOrder.discount}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
