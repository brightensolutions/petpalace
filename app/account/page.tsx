"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header"; // Assuming you have this component
import Footer from "@/components/footer"; // Assuming you have this component
import { AddressModal } from "@/components/address-modal";
// import { toast } from "@/components/ui/use-toast"; // Uncomment if you use shadcn/ui toast

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
  TrendingUp,
  ShoppingBag,
  Wallet,
  Gift,
} from "lucide-react";
import Image from "next/image";

// Define interfaces for better type safety
interface Order {
  id: string;
  date: string;
  status: "delivered" | "shipped" | "processing" | "cancelled";
  total: number;
  items: number;
  image: string;
  trackingId?: string;
}

interface Address {
  _id?: string; // Optional for new addresses, required for updates from DB
  name: string;
  phone: string;
  company?: string;
  address: string; // This will be line1 + line2 combined from modal
  city: string;
  state: string;
  pincode: string;
  country: string;
  label: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  date: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
}

// Define a more complete User interface based on your data structure
interface UserData {
  _id: string;
  name: string;
  email: string;
  number?: string; // Assuming mobile number
  avatar?: string;
  totalOrders?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
  walletBalance?: number;
  addresses: Address[]; // This is crucial for addresses from DB
  // Add other user properties as they come from your /api/users/me endpoint
}

export default function UserDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null); // State to hold address being edited
  const [loading, setLoading] = useState(true); // Keep loading state for initial fetch
  const [activeSection, setActiveSection] = useState("orders"); // Default active section

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/me", {
          credentials: "include", // required to send cookies
        });
        const data = await res.json();
        if (data.authenticated) {
          // Ensure addresses array exists, even if empty
          setUser({ ...data.user, addresses: data.user.addresses || [] });
        } else {
          // Handle unauthenticated user, e.g., redirect to login
          console.warn("User not authenticated. Redirecting to sign-in.");
          // window.location.href = "/sign-in"; // Uncomment to redirect
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Optionally show an error toast
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Show loading indicator or skeleton until user data is fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading user data...</p>{" "}
        {/* Replace with a proper skeleton loader */}
      </div>
    );
  }

  // If user is null after loading, it means they are not authenticated or an error occurred
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Please log in to view your dashboard.</p>
        {/* Optionally, add a login button */}
        <Button onClick={() => (window.location.href = "/sign-in")}>
          Go to Login
        </Button>
      </div>
    );
  }

  // Mock data for sections not directly managed by the AddressModal
  const orders: Order[] = [
    {
      id: "ORD001",
      date: "2024-01-15",
      status: "delivered",
      total: 2599,
      items: 3,
      image: "/placeholder.svg?height=60&width=60&text=Order",
      trackingId: "TRK123456789",
    },
    {
      id: "ORD002",
      date: "2024-01-10",
      status: "shipped",
      total: 1299,
      items: 2,
      image: "/placeholder.svg?height=60&width=60&text=Order",
      trackingId: "TRK987654321",
    },
    {
      id: "ORD003",
      date: "2024-01-05",
      status: "processing",
      total: 899,
      items: 1,
      image: "/placeholder.svg?height=60&width=60&text=Order",
    },
    {
      id: "ORD004",
      date: "2023-12-28",
      status: "cancelled",
      total: 1599,
      items: 2,
      image: "/placeholder.svg?height=60&width=60&text=Order",
    },
  ];

  const transactions: Transaction[] = [
    {
      id: "txn1",
      date: "2024-01-15",
      type: "debit",
      amount: 2599,
      description: "Order #ORD001 - Dog Food & Accessories",
      status: "completed",
    },
    {
      id: "txn2",
      date: "2024-01-12",
      type: "credit",
      amount: 500,
      description: "Cashback from previous order",
      status: "completed",
    },
    {
      id: "txn3",
      date: "2024-01-10",
      type: "debit",
      amount: 1299,
      description: "Order #ORD002 - Cat Litter & Toys",
      status: "completed",
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include", // required to send cookies
      });
      window.location.href = "/sign-in"; // redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error toast
    }
  };

  // Function to handle saving an address (from AddressModal)
  const handleAddressSave = (savedAddress: Address) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      let updatedAddresses: Address[];

      // Check if the savedAddress already exists (by _id)
      const existingAddressIndex = prevUser.addresses.findIndex(
        (addr) => addr._id === savedAddress._id
      );

      if (existingAddressIndex !== -1) {
        // Update existing address
        updatedAddresses = prevUser.addresses.map((addr, index) =>
          index === existingAddressIndex ? savedAddress : addr
        );
      } else {
        // Add new address
        updatedAddresses = [...prevUser.addresses, savedAddress];
      }

      // Handle isDefault logic: if the savedAddress is default, make others non-default
      if (savedAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: addr._id === savedAddress._id, // Only the saved one is default
        }));
      }

      return { ...prevUser, addresses: updatedAddresses };
    });
    // Optionally show a success toast
    // toast({ title: "Address saved successfully!" });
  };

  // Function to handle deleting an address
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
        // toast({ title: "Address deleted successfully!" });
      } else {
        console.error("API Error:", data);
        alert(data.error || "Failed to delete address");
        // toast({ title: "Failed to delete address", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Error deleting address");
      // toast({ title: "Error deleting address", variant: "destructive" });
    }
  };

  // Function to handle setting an address as default
  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/users/addresses/set-default`, {
        method: "PUT", // Or POST, depending on your API
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
            isDefault: addr._id === addressId, // Set this one as default, others as false
          }));
          return { ...prevUser, addresses: updatedAddresses };
        });
        // toast({ title: "Default address updated!" });
      } else {
        console.error("API Error:", data);
        alert(data.error || "Failed to set default address");
        // toast({ title: "Failed to set default address", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      alert("Error setting default address");
      // toast({ title: "Error setting default address", variant: "destructive" });
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
      case "overview":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">
                        {user.totalOrders || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold">
                        ₹{(user.totalSpent || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Coins className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Loyalty Points</p>
                      <p className="text-2xl font-bold">
                        {user.loyaltyPoints || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <Image
                        src={order.image || "/placeholder.svg"}
                        alt="Order"
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">#{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">
                              {order.status}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.items} items • {order.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.total}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                  onClick={() => setActiveSection("orders")}
                >
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          </div>
        );
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
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
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
                          <span className="font-bold text-lg">#{order.id}</span>
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
          </div>
        );
      case "payments":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Payment History</h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download Statement
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold">
                    ₹{(user.totalSpent || 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-600">Cashback Earned</p>
                  <p className="text-2xl font-bold">₹2,340</p>{" "}
                  {/* Mocked value */}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((txn, index) => (
                    <div
                      key={txn.id || index}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          txn.type === "credit" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {txn.type === "credit" ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <Wallet className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{txn.description}</p>
                        <p className="text-sm text-gray-600">{txn.date}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            txn.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                        </p>
                        <Badge
                          className={
                            txn.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {txn.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                  setEditingAddress(null); // Clear any address being edited
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
                        onClick={() => handleEditAddressClick(address)} // Pass the address to edit
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
            <h2 className="text-2xl font-bold">Wallet & Loyalty Points</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet Balance */}
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-purple-100">Wallet Balance</p>
                      <p className="text-3xl font-bold">
                        ₹{(user.walletBalance || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-white/20">
                    Add Money
                  </Button>
                </CardContent>
              </Card>
              {/* Loyalty Points */}
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Coins className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-orange-100">Loyalty Points</p>
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
            {/* Points History */}
            <Card>
              <CardHeader>
                <CardTitle>Points History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      date: "2024-01-15",
                      points: 250,
                      type: "earned",
                      desc: "Order #ORD001",
                    },
                    {
                      date: "2024-01-10",
                      points: 500,
                      type: "redeemed",
                      desc: "Discount on Order #ORD002",
                    },
                    {
                      date: "2024-01-05",
                      points: 100,
                      type: "earned",
                      desc: "Product Review",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.type === "earned" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <Coins
                          className={`w-5 h-5 ${
                            item.type === "earned"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.desc}</p>
                        <p className="text-sm text-gray-600">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            item.type === "earned"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.type === "earned" ? "+" : "-"}
                          {item.points} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-6">
            {/* Contact Info Section */}
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
            {/* Address Section */}
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
      default:
        return <div>Section not found</div>;
    }
  };

  const handleEditAddressClick = (address: Address) => {
    setEditingAddress(address); // Set the address to be edited
    setShowAddressModal(true);
  };

  const handleAddressModalClose = () => {
    setShowAddressModal(false);
    setEditingAddress(null); // Clear editing address on close
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-orange-100 text-orange-600 flex items-center justify-center">
                        {/* Assuming PawPrint is imported */}
                        {/* <PawPrint className="w-5 h-5" /> */}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Welcome Back!</p>
                      <p className="text-sm text-gray-600">
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
                      className="w-full justify-start text-base text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5 mr-3 text-red-600" />
                      Logout
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            {/* Main Content */}
            <div className="lg:col-span-3">{renderContent()}</div>
          </div>
        </div>
      </div>
      <AddressModal
        isOpen={showAddressModal}
        onClose={handleAddressModalClose}
        onSave={handleAddressSave}
        initialAddress={editingAddress} // Pass the address to be edited
      />
      <Footer />
    </div>
  );
}
