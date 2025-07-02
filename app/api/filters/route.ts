// app/api/filters/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Filter from "@/lib/models/Filter";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const filters = await Filter.find().sort({ name: 1 });
    return NextResponse.json(filters);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
