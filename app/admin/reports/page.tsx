"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Calendar,
} from "lucide-react";

interface ReportStats {
  totalRevenue: number;
  totalOrders: number;
  successfulOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
}

interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface OrderData {
  orderNumber: string;
  total: number;
  status: string;
  date: string;
  items: number;
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");
  const [stats, setStats] = useState<ReportStats>({
    totalRevenue: 0,
    totalOrders: 0,
    successfulOrders: 0,
    pendingOrders: 0,
    averageOrderValue: 0,
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Set default date range (last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReports();
    }
  }, [period, startDate, endDate]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      console.log("[v0] Fetching reports with params:", {
        period,
        startDate,
        endDate,
      });
      const response = await fetch(
        `/api/admin/reports?period=${period}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();

      console.log("[v0] Reports API response:", data);

      if (data.success) {
        console.log("[v0] Chart data:", data.data.chartData);
        setStats(data.data.stats);
        setChartData(data.data.chartData);
        setOrders(data.data.orders);
      } else {
        console.error("[v0] Reports API returned error:", data.message);
      }
    } catch (error) {
      console.error("[v0] Failed to fetch reports:", error);
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

  const exportToCSV = () => {
    const headers = ["Date", "Revenue", "Orders"];
    const rows = chartData.map((item) => [
      item.date,
      item.revenue.toFixed(2),
      item.orders,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${period}-${startDate}-to-${endDate}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    // Simple PDF export using window.print
    window.print();
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Successful Orders",
      value: stats.successfulOrders.toLocaleString(),
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toLocaleString(),
      icon: Clock,
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(stats.averageOrderValue),
      icon: TrendingUp,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-black via-blue-900 to-blue-700 bg-clip-text text-transparent">
            Sales Reports
          </h1>
          <p className="text-slate-600 mt-1">
            Analyze your sales performance over time
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="border-blue-200 hover:bg-blue-50 bg-transparent"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={exportToPDF}
            variant="outline"
            className="border-orange-200 hover:bg-orange-50 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Date Filter */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Date Range Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-slate-300"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-slate-300"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={fetchReports}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="relative overflow-hidden border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5`}
              />
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative">
                <CardTitle className="text-sm font-medium text-slate-700">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${card.iconBg} shadow-sm`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-black">
                  {loading ? "..." : card.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Period Tabs and Chart */}
      <Tabs
        value={period}
        onValueChange={(v) => setPeriod(v as any)}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4 bg-slate-100">
          <TabsTrigger
            value="daily"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Daily
          </TabsTrigger>
          <TabsTrigger
            value="weekly"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Weekly
          </TabsTrigger>
          <TabsTrigger
            value="monthly"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Monthly
          </TabsTrigger>
          <TabsTrigger
            value="yearly"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Yearly
          </TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-4">
          {/* Chart Card */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center text-slate-500">
                  Loading chart data...
                </div>
              ) : chartData.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <TrendingUp className="h-12 w-12 text-slate-300" />
                  <p className="text-lg font-medium">No data available</p>
                  <p className="text-sm">
                    No orders found for the selected period
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-64 flex items-end gap-2 overflow-x-auto pb-4 px-2">
                    {chartData.map((item, index) => {
                      const maxRevenue = Math.max(
                        ...chartData.map((d) => d.revenue),
                        1
                      ); // Ensure minimum of 1
                      const heightPercentage =
                        maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                      const height = Math.max(heightPercentage, 5); // Minimum 5% height for visibility

                      return (
                        <div
                          key={index}
                          className="flex-1 min-w-[60px] flex flex-col items-center gap-2"
                        >
                          <div
                            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer relative group"
                            style={{ height: `${height}%`, minHeight: "20px" }}
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              <div className="font-semibold">
                                {formatCurrency(item.revenue)}
                              </div>
                              <div className="text-[10px] text-slate-300">
                                {item.orders} orders
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-600 text-center truncate w-full">
                            {period === "yearly"
                              ? item.date
                              : period === "monthly"
                              ? new Date(item.date + "-01").toLocaleDateString(
                                  "en-IN",
                                  {
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : new Date(item.date).toLocaleDateString(
                                  "en-IN",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-gradient-to-t from-blue-500 to-blue-400"></div>
                        <span className="text-sm text-slate-600">Revenue</span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      Showing {chartData.length} data points
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Order Number
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Items
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-3 px-4 text-sm text-slate-900 font-medium">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {new Date(order.date).toLocaleDateString("en-IN")}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {order.items}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-900 font-semibold">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
