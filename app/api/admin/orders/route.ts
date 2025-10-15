import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Order from "@/lib/models/Order";

// GET /api/admin/orders
// Query params (all optional):
//  - q: string (search across order number, statuses, userId, and address name/email)
//  - page: number (1-based; defaults to 1)
//  - limit: number (defaults to 1000; client paginates)
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const pageParam = url.searchParams.get("page") || "1";
  const limitParam = url.searchParams.get("limit") || "1000";

  // Coerce to safe numbers
  const page = Math.max(Number.parseInt(pageParam, 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(limitParam, 10) || 1000, 1),
    1000
  );
  const skip = (page - 1) * limit;

  try {
    console.log("[v0][admin/orders][GET] incoming", { q, page, limit });

    await dbConnect();
    console.log("[v0][admin/orders][GET] DB connected");

    // Build flexible filter similar to categories approach
    const filter: Record<string, any> = {};
    if (q) {
      filter.$or = [
        { orderNumber: { $regex: q, $options: "i" } },
        { paymentStatus: { $regex: q, $options: "i" } },
        { orderStatus: { $regex: q, $options: "i" } },
        { userId: { $regex: q, $options: "i" } }, // string match for ObjectId string
        { "address.name": { $regex: q, $options: "i" } },
        { "address.email": { $regex: q, $options: "i" } },
        { "address.phone": { $regex: q, $options: "i" } },
        { "address.city": { $regex: q, $options: "i" } },
        { "address.state": { $regex: q, $options: "i" } },
        { "address.pincode": { $regex: q, $options: "i" } },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        // .populate("userId") // uncomment if you have a User model and want populated user fields
        .lean(),
      Order.countDocuments(filter),
    ]);

    console.log("[v0][admin/orders][GET] returning", {
      count: orders.length,
      total,
    });

    return NextResponse.json({
      success: true,
      data: orders,
      meta: { page, limit, total },
    });
  } catch (err: any) {
    console.error("[v0][admin/orders][GET] error", {
      message: err?.message,
      stack: err?.stack,
      hasMONGODB_URI: Boolean(process.env.MONGODB_URI),
    });

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, message: "Missing MONGODB_URI environment variable" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Explicitly disallow POST on this route, similar to keeping routes focused
export async function POST() {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed" },
    { status: 405 }
  );
}
