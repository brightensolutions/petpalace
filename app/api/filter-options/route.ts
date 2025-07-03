import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import FilterOption from "@/lib/models/FilterOption";

export async function GET() {
  try {
    await dbConnect();
    const options = await FilterOption.find();
    return NextResponse.json(options);
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
