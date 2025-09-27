import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Category from "@/lib/models/Category";

export async function GET() {
  try {
    console.log("[v0] API: Starting category fetch...");
    await dbConnect();

    const categories = await Category.find().sort({ parentId: 1, name: 1 });
    console.log("[v0] API: Found categories:", categories.length);
    console.log("[v0] API: Categories data:", categories);

    return NextResponse.json(categories, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("[v0] API: Categories API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
