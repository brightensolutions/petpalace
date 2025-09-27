// File: app/api/admin/trending-categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import mongoose, { Schema, model, models } from "mongoose";

// Define schema for TrendingCategory
const TrendingCategorySchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite issue in Next.js
const TrendingCategory =
  models.TrendingCategory || model("TrendingCategory", TrendingCategorySchema);

// GET all trending categories
export async function GET() {
  try {
    await dbConnect();
    const trending = await TrendingCategory.find().lean();
    return NextResponse.json({ success: true, data: trending });
  } catch (err) {
    console.error("GET trending categories error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST update trending categories
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { categories } = body;

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { success: false, message: "Invalid categories array" },
        { status: 400 }
      );
    }

    // Optional: enforce max 16 categories
    if (categories.length > 16) {
      return NextResponse.json(
        {
          success: false,
          message: "You can select max 16 trending categories",
        },
        { status: 400 }
      );
    }

    // Clear old trending categories
    await TrendingCategory.deleteMany({});

    // Insert new trending categories
    const docs = categories.map((id: string) => ({ categoryId: id }));
    await TrendingCategory.insertMany(docs);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST trending categories error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
