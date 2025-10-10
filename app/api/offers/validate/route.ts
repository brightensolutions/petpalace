import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Offer from "@/lib/models/Offer";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { couponCode, cartValue, productIds } = body;

    if (!couponCode || cartValue === undefined) {
      return NextResponse.json(
        { success: false, message: "Coupon code and cart value are required." },
        { status: 400 }
      );
    }

    // Find the offer
    const offer = await Offer.findOne({
      couponCode: couponCode.toUpperCase(),
      status: "active",
    }).lean();

    if (!offer) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired coupon code." },
        { status: 404 }
      );
    }

    // Check if offer is valid
    const now = new Date();
    if (offer.startDate && now < new Date(offer.startDate)) {
      return NextResponse.json(
        { success: false, message: "This offer is not yet active." },
        { status: 400 }
      );
    }
    if (offer.expiryDate && now > new Date(offer.expiryDate)) {
      return NextResponse.json(
        { success: false, message: "This offer has expired." },
        { status: 400 }
      );
    }

    // Check usage limit
    if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
      return NextResponse.json(
        { success: false, message: "This offer has reached its usage limit." },
        { status: 400 }
      );
    }

    // Check minimum cart value
    if (offer.minCartValue && cartValue < offer.minCartValue) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum cart value of ₹${offer.minCartValue} required.`,
          minCartValue: offer.minCartValue,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (offer.type === "percentage") {
      discount = Math.floor((cartValue * offer.value) / 100);
      if (offer.maxDiscount && discount > offer.maxDiscount) {
        discount = offer.maxDiscount;
      }
    } else if (offer.type === "amount") {
      discount = offer.value;
    }

    return NextResponse.json({
      success: true,
      data: {
        offerId: offer._id,
        couponCode: offer.couponCode,
        name: offer.name,
        type: offer.type,
        value: offer.value,
        discount,
        description: offer.description,
        buyXGetY: offer.buyXGetY, // Include Buy X Get Y data
      },
    });
  } catch (error: any) {
    console.error("POST /api/offers/validate error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
