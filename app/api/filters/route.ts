import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Filter from "@/lib/models/Filter";

export async function GET() {
  try {
    await dbConnect();
    const filters = await Filter.find().sort({ name: 1 });
    return NextResponse.json(filters);
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
