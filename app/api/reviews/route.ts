// app/api/reviews/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Review from "@/lib/models/Review";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const reviews = await Review.find();
    return NextResponse.json(reviews);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
