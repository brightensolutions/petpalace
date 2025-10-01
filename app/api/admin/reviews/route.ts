import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Review from "@/lib/models/Review";

// GET /api/admin/reviews - Fetch all reviews (approved and pending)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status"); // 'all', 'pending', 'approved'

    let filter = {};
    if (status === "pending") {
      filter = { approved: false };
    } else if (status === "approved") {
      filter = { approved: true };
    }

    const reviews = await Review.find(filter)
      .populate("product", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
