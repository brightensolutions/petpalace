import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Topbar from "@/lib/models/Topbar";

export async function GET() {
  try {
    await dbConnect();

    const topbar = await Topbar.findOne().sort({ createdAt: -1 });

    if (!topbar) {
      return NextResponse.json({
        success: true,
        content: "",
      });
    }

    return NextResponse.json({
      success: true,
      content: topbar.text,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch topbar content",
      },
      { status: 500 }
    );
  }
}
