"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  User,
  Package,
  CreditCard,
  MapPin,
  Wallet,
  Heart,
  Bell,
  Settings,
  LogOut,
  Edit,
  Plus,
  Eye,
  Download,
  Star,
  Gift,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  Building,
  Phone,
  Award,
  TrendingUp,
  ShoppingBag,
  Coins,
} from "lucide-react";
import Image from "next/image";

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
  id: string;
  type: "home" | "office" | "other";
  name: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
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

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    avatar: "/placeholder.svg?height=100&width=100&text=JD",
    joinDate: "January 2023",
    totalOrders: 24,
    totalSpent: 45670,
    walletBalance: 1250,
    loyaltyPoints: 3420,
    membershipTier: "Gold",
  };

  // Mock orders data
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

  // Mock addresses
  const addresses: Address[] = [
    {
      id: "addr1",
      type: "home",
      name: "John Doe",
      address: "123 Pet Street, Koramangala",
      city: "Bangalore",
      pincode: "560034",
      phone: "+91 98765 43210",
      isDefault: true,
    },
    {
      id: "addr2",
      type: "office",
      name: "John Doe",
      address: "456 Tech Park, Electronic City",
      city: "Bangalore",
      pincode: "560100",
      phone: "+91 98765 43210",
      isDefault: false,
    },
  ];

  // Mock transactions
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

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wallet", label: "Wallet & Points", icon: Wallet },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: "Profile", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
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
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-4 border-white/20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">
                    Welcome back, {user.name}!
                  </h1>
                  <p className="text-orange-100">
                    Member since {user.joinDate}
                  </p>
                  <Badge className="bg-white/20 text-white mt-2">
                    <Award className="w-3 h-3 mr-1" />
                    {user.membershipTier} Member
                  </Badge>
                </div>
              </div>
            </div>

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
                      <p className="text-2xl font-bold">{user.totalOrders}</p>
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
                        ₹{user.totalSpent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Wallet Balance</p>
                      <p className="text-2xl font-bold">
                        ₹{user.walletBalance}
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
                      <p className="text-2xl font-bold">{user.loyaltyPoints}</p>
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
                    ₹{user.totalSpent.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Successful Payments</p>
                  <p className="text-2xl font-bold">{user.totalOrders}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-600">Cashback Earned</p>
                  <p className="text-2xl font-bold">₹2,340</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
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
                          <CreditCard className="w-5 h-5 text-red-600" />
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
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-1" />
                Add New Address
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <Card
                  key={address.id}
                  className={address.isDefault ? "ring-2 ring-orange-500" : ""}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {address.type === "home" ? (
                          <Home className="w-5 h-5 text-blue-600" />
                        ) : address.type === "office" ? (
                          <Building className="w-5 h-5 text-green-600" />
                        ) : (
                          <MapPin className="w-5 h-5 text-gray-600" />
                        )}
                        <span className="font-semibold capitalize">
                          {address.type}
                        </span>
                        {address.isDefault && (
                          <Badge className="bg-orange-100 text-orange-800">
                            Default
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">{address.name}</p>
                      <p className="text-gray-600">{address.address}</p>
                      <p className="text-gray-600">
                        {address.city} - {address.pincode}
                      </p>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {address.phone}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {!address.isDefault && (
                        <Button variant="outline" size="sm">
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
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
                        ₹{user.walletBalance}
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
                      <p className="text-3xl font-bold">{user.loyaltyPoints}</p>
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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl font-bold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                    >
                      Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      defaultValue={user.name}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user.email}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      defaultValue={user.phone}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 mt-6">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  Two-Factor Authentication
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
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
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">
                        {user.membershipTier} Member
                      </p>
                    </div>
                  </div>

                  <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={
                          activeSection === item.id ? "default" : "ghost"
                        }
                        className={`w-full justify-start ${
                          activeSection === item.id
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
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

      <Footer />
    </div>
  );
}
