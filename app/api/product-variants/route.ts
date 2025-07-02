// app/api/product-variants/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import ProductVariant from "@/lib/models/ProductVariant";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const variants = await ProductVariant.find();
    return NextResponse.json(variants);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
