import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import ProductOffer from "@/lib/models/ProductOffer";

export async function GET() {
  try {
    await dbConnect();
    const offers = await ProductOffer.find();
    return NextResponse.json(offers);
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
