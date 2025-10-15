import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import Brand from "@/lib/models/Brand";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await dbConnect();

    const [
      totalProducts,
      totalCategories,
      totalBrands,
      totalOrders,
      pendingOrders,
      successfulOrders,
      revenueData,
      totalUsers,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Brand.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$total" },
          },
        },
      ]),
      User.countDocuments(),
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        totalBrands,
        totalRevenue,
        totalOrders,
        pendingOrders,
        successfulOrders,
        totalUsers,
      },
    });
  } catch (error) {
    console.error("[v0] Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
