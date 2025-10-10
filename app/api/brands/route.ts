import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Brand from "@/lib/models/Brand";

export async function GET() {
  try {
    await dbConnect();
    const brands = await Brand.find().sort({ name: 1 });

    return NextResponse.json({
      success: true,
      data: brands,
    });
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
