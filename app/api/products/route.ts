import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find()
      .populate("category_id")
      .populate("brand_id");

    return NextResponse.json(products);
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
