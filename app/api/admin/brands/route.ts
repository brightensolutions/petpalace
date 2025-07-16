import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Brand from "@/lib/models/Brand";

export async function GET() {
  await dbConnect();
  try {
    const brands = await Brand.find({});
    return NextResponse.json({ success: true, data: brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
