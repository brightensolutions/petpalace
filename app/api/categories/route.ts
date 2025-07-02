// app/api/categories/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Category from "@/lib/models/Category";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ parentId: 1, name: 1 });
    return NextResponse.json(categories);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
