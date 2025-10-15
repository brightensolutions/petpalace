import { NextResponse } from "next/server";
import connect from "@/lib/db/db";
import Order from "@/lib/models/Order";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    console.log("[v0][admin/orders/:id][GET] id:", params.id);
    await connect();
    const order = await Order.findById(params.id).lean();
    if (!order) {
      console.log("[v0][admin/orders/:id][GET] not found");
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (err: any) {
    console.error("[v0][admin/orders/:id][GET] error", err?.message);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await connect();
    const body = await req.json();
    console.log("[v0][admin/orders/:id][PUT] id/body:", params.id, body);

    const updates: any = {};
    if (body.paymentStatus) updates.paymentStatus = body.paymentStatus;
    if (body.orderStatus) updates.orderStatus = body.orderStatus;
    if (typeof body.notes === "string") updates.notes = body.notes;

    const updated = await Order.findByIdAndUpdate(params.id, updates, {
      new: true,
    }).lean();
    if (!updated) {
      console.log("[v0][admin/orders/:id][PUT] not found");
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err: any) {
    console.error("[v0][admin/orders/:id][PUT] error", err?.message);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await connect();
    console.log("[v0][admin/orders/:id][DELETE] id:", params.id);
    const deleted = await Order.findByIdAndDelete(params.id).lean();
    if (!deleted) {
      console.log("[v0][admin/orders/:id][DELETE] not found");
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: { ok: true } },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[v0][admin/orders/:id][DELETE] error", err?.message);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}
