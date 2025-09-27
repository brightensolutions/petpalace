// app/api/sliders/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db"; // your mongoose connection file
import Slider from "@/lib/models/Slider";

export async function GET() {
  try {
    await dbConnect();

    const sliders = await Slider.find().sort({ createdAt: -1 }); // latest first

    return NextResponse.json(sliders, { status: 200 });
  } catch (err) {
    console.error("Error fetching sliders:", err);
    return NextResponse.json(
      { message: "Failed to fetch sliders" },
      { status: 500 }
    );
  }
}
