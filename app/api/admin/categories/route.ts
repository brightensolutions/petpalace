// File: /app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Category from "@/lib/models/Category";

// GET categories
export async function GET() {
  await dbConnect();
  const categories = await Category.find();
  return NextResponse.json({ success: true, data: categories });
}

// POST new category
export async function POST(req: NextRequest) {
  await dbConnect();
  const formData = await req.formData();

  const name = formData.get("name")?.toString();
  const slug = formData.get("slug")?.toString();
  const parentId = formData.get("parentId")?.toString() || null;

  if (!name || !slug) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  const newCat = await Category.create({ name, slug, parentId });
  return NextResponse.json({ success: true, data: newCat }, { status: 201 });
}
