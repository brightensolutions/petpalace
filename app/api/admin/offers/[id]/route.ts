import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Offer from "@/lib/models/Offer";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const offer = await Offer.findById(params.id)
      .populate("applicableProducts", "name slug")
      .populate("excludedProducts", "name slug")
      .populate("buyXGetY.buyProducts", "name slug")
      .populate("buyXGetY.getProducts", "name slug")
      .lean();

    if (!offer) {
      return NextResponse.json(
        { success: false, message: "Offer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: offer });
  } catch (err) {
    console.error(`GET /api/admin/offers/${params.id} error:`, err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Check if offer exists
    const existingOffer = await Offer.findById(params.id);
    if (!existingOffer) {
      return NextResponse.json(
        { success: false, message: "Offer not found" },
        { status: 404 }
      );
    }

    // Check if coupon code is being changed and if it already exists
    if (couponCode && couponCode.toUpperCase() !== existingOffer.couponCode) {
      const duplicateOffer = await Offer.findOne({
        couponCode: couponCode.toUpperCase(),
        _id: { $ne: params.id },
      });
      if (duplicateOffer) {
        return NextResponse.json(
          { success: false, message: "Coupon code already exists." },
          { status: 409 }
        );
      }
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

    // Update offer
    const updatedOffer = await Offer.findByIdAndUpdate(
      params.id,
      {
        name,
        couponCode: couponCode
          ? couponCode.toUpperCase()
          : existingOffer.couponCode,
        type,
        value,
        status,
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
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Offer updated successfully!",
      data: updatedOffer,
    });
  } catch (error: any) {
    console.error(`PUT /api/admin/offers/${params.id} error:`, error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const offer = await Offer.findByIdAndDelete(params.id);

    if (!offer) {
      return NextResponse.json(
        { success: false, message: "Offer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Offer deleted successfully!",
    });
  } catch (err) {
    console.error(`DELETE /api/admin/offers/${params.id} error:`, err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
