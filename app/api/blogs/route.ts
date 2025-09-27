// app/api/blogs/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db"; // your mongoose connection file
import Blog from "@/lib/models/Blog";

export async function GET() {
  try {
    await dbConnect();

    const blogs = await Blog.find().sort({ createdAt: -1 }); // latest first

    return NextResponse.json(blogs, { status: 200 });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return NextResponse.json(
      { message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
