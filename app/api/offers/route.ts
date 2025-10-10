import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Offer from "@/lib/models/Offer";

export async function GET() {
  try {
    await dbConnect();

    // Update expired offers before fetching
    await Offer.updateExpiredOffers();

    // Fetch only active offers that have started and not expired
    const now = new Date();
    const offers = await Offer.find({
      status: "active",
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: { $lte: now } },
          ],
        },
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: { $gte: now } },
          ],
        },
      ],
    })
      .select("-usageCount -createdAt -updatedAt -__v")
      .lean();

    return NextResponse.json({ success: true, data: offers });
  } catch (err) {
    console.error("GET /api/offers error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
