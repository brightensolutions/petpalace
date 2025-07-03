import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import ProductFilter from "@/lib/models/ProductFilter";

export async function GET() {
  try {
    await dbConnect();
    const filters = await ProductFilter.find();
    return NextResponse.json(filters);
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
