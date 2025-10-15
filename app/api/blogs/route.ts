import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Blog from "@/lib/models/Blog";

export async function GET() {
  try {
    await dbConnect();

    const blogs = await Blog.find({ active: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("[v0] Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
