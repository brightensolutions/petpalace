import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Order from "@/lib/models/Order";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get("period") || "daily"; // daily, weekly, monthly, yearly
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build date filter
    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Fetch all orders within date range
    const orders = await Order.find(dateFilter).sort({ createdAt: 1 }).lean();

    // Calculate overall stats
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );
    const totalOrders = orders.length;
    const successfulOrders = orders.filter(
      (order) => order.orderStatus === "delivered"
    ).length;
    const pendingOrders = orders.filter(
      (order) =>
        order.orderStatus === "pending" || order.orderStatus === "confirmed"
    ).length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Group orders by period
    const groupedData = groupOrdersByPeriod(orders, period);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          totalOrders,
          successfulOrders,
          pendingOrders,
          averageOrderValue,
        },
        chartData: groupedData,
        orders: orders.map((order) => ({
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.orderStatus,
          date: order.createdAt,
          items: order.items?.length || 0,
        })),
      },
    });
  } catch (error) {
    console.error("[v0] Reports API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

function groupOrdersByPeriod(orders: any[], period: string) {
  const grouped: { [key: string]: { revenue: number; orders: number } } = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    let key: string;

    switch (period) {
      case "daily":
        key = date.toISOString().split("T")[0]; // YYYY-MM-DD
        break;
      case "weekly":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
        break;
      case "monthly":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        break;
      case "yearly":
        key = String(date.getFullYear());
        break;
      default:
        key = date.toISOString().split("T")[0];
    }

    if (!grouped[key]) {
      grouped[key] = { revenue: 0, orders: 0 };
    }

    grouped[key].revenue += order.total || 0;
    grouped[key].orders += 1;
  });

  // Convert to array and sort by date
  return Object.entries(grouped)
    .map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
