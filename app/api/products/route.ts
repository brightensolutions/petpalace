// app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const products = await Product.find()
      .populate("category_id")
      .populate("brand_id");

    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
