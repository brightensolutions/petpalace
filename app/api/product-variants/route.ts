import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import ProductVariant from "@/lib/models/ProductVariant";

export async function GET() {
  try {
    await dbConnect();
    const variants = await ProductVariant.find();
    return NextResponse.json(variants);
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
