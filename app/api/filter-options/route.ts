// app/api/filter-options/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import FilterOption from "@/lib/models/FilterOption";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const options = await FilterOption.find();
    return NextResponse.json(options);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
