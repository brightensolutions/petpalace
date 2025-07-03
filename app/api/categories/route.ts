import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Category from "@/lib/models/Category";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ parentId: 1, name: 1 });
    return NextResponse.json(categories);
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
