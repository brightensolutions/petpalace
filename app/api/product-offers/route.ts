// app/api/product-offers/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import ProductOffer from "@/lib/models/ProductOffer";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const offers = await ProductOffer.find();
    return NextResponse.json(offers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
