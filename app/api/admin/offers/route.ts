import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Offer from "@/lib/models/Offer";

export async function GET() {
  try {
    await dbConnect();

    // Update expired offers before fetching
    await Offer.updateExpiredOffers();

    const offers = await Offer.find()
      .populate("applicableProducts", "name slug")
      .populate("excludedProducts", "name slug")
      .populate("buyXGetY.buyProducts", "name slug")
      .populate("buyXGetY.getProducts", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: offers });
  } catch (err) {
    console.error("GET /api/admin/offers error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      name,
      couponCode,
      type,
      value,
      status,
      startDate,
      expiryDate,
      minCartValue,
      maxDiscount,
      applicableProducts,
      excludedProducts,
      buyXGetY,
      usageLimit,
      perUserLimit,
      description,
      termsAndConditions,
    } = body;

    // Validation
    if (!name || !couponCode || !type || value === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, coupon code, type, and value are required.",
        },
        { status: 400 }
      );
    }

    // Check if coupon code already exists
    const existingOffer = await Offer.findOne({
      couponCode: couponCode.toUpperCase(),
    });
    if (existingOffer) {
      return NextResponse.json(
        { success: false, message: "Coupon code already exists." },
        { status: 409 }
      );
    }

    // Validate percentage value
    if (type === "percentage" && (value < 0 || value > 100)) {
      return NextResponse.json(
        {
          success: false,
          message: "Percentage value must be between 0 and 100.",
        },
        { status: 400 }
      );
    }

    // Create offer
    const offer = await Offer.create({
      name,
      couponCode: couponCode.toUpperCase(),
      type,
      value,
      status: status || "active",
      startDate: startDate ? new Date(startDate) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      minCartValue,
      maxDiscount,
      applicableProducts: applicableProducts || [],
      excludedProducts: excludedProducts || [],
      buyXGetY: buyXGetY?.enabled ? buyXGetY : undefined,
      usageLimit,
      perUserLimit,
      description,
      termsAndConditions,
    });

    return NextResponse.json(
      { success: true, message: "Offer created successfully!", data: offer },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/admin/offers error:", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
