// app/api/brands/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Brand from "@/lib/models/Brand";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const brands = await Brand.find().sort({ name: 1 });
    return NextResponse.json(brands);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
