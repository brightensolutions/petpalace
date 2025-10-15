"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  FolderTree,
  Tag,
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Users,
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  successfulOrders: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalBrands: 0,
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    successfulOrders: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: loading ? "..." : formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      description: "All-time revenue",
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Total Orders",
      value: loading ? "..." : stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      description: "All orders placed",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Successful Orders",
      value: loading ? "..." : stats.successfulOrders.toLocaleString(),
      icon: CheckCircle,
      description: "Completed orders",
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "Pending Orders",
      value: loading ? "..." : stats.pendingOrders.toLocaleString(),
      icon: Clock,
      description: "Awaiting processing",
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
    {
      title: "Total Products",
      value: loading ? "..." : stats.totalProducts.toLocaleString(),
      icon: Package,
      description: "Active products",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Categories",
      value: loading ? "..." : stats.totalCategories.toLocaleString(),
      icon: FolderTree,
      description: "Product categories",
      gradient: "from-slate-600 to-slate-700",
      iconBg: "bg-slate-50",
      iconColor: "text-slate-600",
      borderColor: "border-slate-200",
    },
    {
      title: "Total Brands",
      value: loading ? "..." : stats.totalBrands.toLocaleString(),
      icon: Tag,
      description: "Registered brands",
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers.toLocaleString(),
      icon: Users,
      description: "Registered users",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-black via-blue-900 to-blue-700 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Monitor your store's performance and key metrics
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className={`relative overflow-hidden border ${card.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white`}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5`}
              />

              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative">
                <CardTitle className="text-sm font-medium text-slate-700">
                  {card.title}
                </CardTitle>
                <div
                  className={`p-2 sm:p-3 rounded-xl ${card.iconBg} shadow-sm`}
                >
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl sm:text-3xl font-bold text-black">
                  {card.value}
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="border-b border-blue-200">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-blue-900">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              Order Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-orange-100">
              <span className="text-sm font-medium text-slate-700">
                Pending
              </span>
              <span className="font-bold text-orange-600 text-lg">
                {stats.pendingOrders}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-green-100">
              <span className="text-sm font-medium text-slate-700">
                Successful
              </span>
              <span className="font-bold text-green-600 text-lg">
                {stats.successfulOrders}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
              <span className="text-sm font-medium text-white">
                Total Orders
              </span>
              <span className="font-bold text-white text-lg">
                {stats.totalOrders}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-slate-900">
              <Package className="h-4 w-4 sm:h-5 sm:w-5" />
              Catalog Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-blue-100">
              <span className="text-sm font-medium text-slate-700">
                Products
              </span>
              <span className="font-bold text-blue-600 text-lg">
                {stats.totalProducts}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-slate-200">
              <span className="text-sm font-medium text-slate-700">
                Categories
              </span>
              <span className="font-bold text-slate-600 text-lg">
                {stats.totalCategories}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-orange-100">
              <span className="text-sm font-medium text-slate-700">Brands</span>
              <span className="font-bold text-orange-600 text-lg">
                {stats.totalBrands}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="border-b border-green-200">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-green-900">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
              Revenue & Users
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md">
              <span className="text-sm font-medium text-white">
                Total Revenue
              </span>
              <span className="font-bold text-white text-base sm:text-lg">
                {formatCurrency(stats.totalRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-green-100">
              <span className="text-sm font-medium text-slate-700">
                Avg. Order Value
              </span>
              <span className="font-bold text-green-600 text-lg">
                {stats.totalOrders > 0
                  ? formatCurrency(stats.totalRevenue / stats.totalOrders)
                  : "₹0"}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-blue-100">
              <span className="text-sm font-medium text-slate-700">
                Total Users
              </span>
              <span className="font-bold text-blue-600 text-lg">
                {stats.totalUsers}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
