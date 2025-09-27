import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db"; // your mongoose connection file
import TrendingCategory from "@/lib/models/TrendingCategory";
import Category from "@/lib/models/Category";

export async function GET() {
  try {
    await dbConnect();

    // Get trending categories
    const trending = await TrendingCategory.find().lean();

    // Fetch full category details
    const categoryIds = trending.map((t) => t.categoryId);
    const categories = await Category.find({
      _id: { $in: categoryIds },
    }).lean();

    // Map to frontend format
    const data = categories.map((c) => ({
      _id: c._id,
      name: c.name,
      image: c.image || "/placeholder.svg",
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Error fetching trending categories:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
