import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Review from "@/lib/models/Review";

export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find();
    return NextResponse.json(reviews);
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
