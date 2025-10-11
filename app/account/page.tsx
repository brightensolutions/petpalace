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
  Download,
  Star,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Package,
} from "lucide-react";
import Image from "next/image";

interface Order {
  id: string;
  _id: string;
  date: string;
  status: "delivered" | "shipped" | "processing" | "cancelled";
  total: number;
  items: number;
  image: string;
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

export default function UserDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("orders");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.authenticated) {
          setUser({ ...data.user, addresses: data.user.addresses || [] });
        } else {
          console.warn("User not authenticated. Redirecting to sign-in.");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/users/orders", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.orders) {
          const mappedOrders = data.orders.map((order: any) => ({
            _id: order._id,
            id: order.orderNumber,
            date: new Date(order.createdAt).toLocaleDateString(),
            status: order.orderStatus,
            total: order.total,
            items: order.items.length,
            image:
              order.items[0]?.image ||
              "/placeholder.svg?height=100&width=100&text=Order",
            trackingId: order.orderNumber,
          }));
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/users/wishlist", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setWishlistItems(data.wishlist || []);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
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
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order._id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Image
                          src={order.image || "/placeholder.svg"}
                          alt="Order"
                          width={80}
                          height={80}
                          className="rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-lg">
                              #{order.id}
                            </span>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">
                                {order.status}
                              </span>
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-1">
                            Order Date: {order.date}
                          </p>
                          <p className="text-gray-600 mb-2">
                            {order.items} items
                          </p>
                          {order.trackingId && (
                            <p className="text-sm text-blue-600">
                              Tracking ID: {order.trackingId}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold mb-2">
                            ₹{order.total}
                          </p>
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-transparent"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            {order.status === "delivered" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent"
                              >
                                <Star className="w-4 h-4 mr-1" />
                                Rate & Review
                              </Button>
                            )}
                            {order.status === "shipped" && (
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
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export Wishlist
              </Button>
            </div>

            {wishlistItems?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item._id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
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
                            <Button size="sm" variant="outline">
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
      <Footer />
    </div>
  );
}
