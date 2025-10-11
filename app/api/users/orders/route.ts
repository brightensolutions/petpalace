import { type NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import Order from "@/lib/models/Order";
import { getUserFromToken } from "@/lib/utils/jwt";
import type { Types } from "mongoose";

interface OrderItem {
  productId: Types.ObjectId | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantLabel?: string;
  foodType?: string;
}

interface OrderDocument {
  _id: Types.ObjectId;
  orderNumber: string;
  items: OrderItem[];
  pets?: any[];
  address: any;
  subtotal: number;
  deliveryFee?: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  couponCode?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const userId = await getUserFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find orders for the user, sorted by newest first
    const orders = (await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean()) as unknown as OrderDocument[];

    // Format orders for frontend
    const formattedOrders = orders.map((order) => ({
      _id: order._id.toString(),
      orderNumber: order.orderNumber,
      items: order.items.map((item) => ({
        productId:
          typeof item.productId === "string"
            ? item.productId
            : item.productId.toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image:
          item.image || "/placeholder.svg?height=100&width=100&text=Product",
        variantLabel: item.variantLabel,
        foodType: item.foodType,
      })),
      pets: order.pets || [],
      address: order.address,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee || 0,
      discount: order.discount || 0,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      couponCode: order.couponCode,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("[v0] Get orders error:", error);
    return NextResponse.json(
      {
        error: "Unable to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
