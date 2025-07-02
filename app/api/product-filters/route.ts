// app/api/product-filters/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import ProductFilter from "@/lib/models/ProductFilter";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const filters = await ProductFilter.find();
    return NextResponse.json(filters);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
