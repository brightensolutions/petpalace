import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import TopbarContent from "@/lib/models/Topbar";

// GET Topbar Content
export async function GET() {
  await dbConnect();
  const content = await TopbarContent.findOne();
  return NextResponse.json({ content: content?.text || "" });
}

// POST (Add / Update) Topbar Content
export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    await dbConnect();

    let existing = await TopbarContent.findOne();
    if (existing) {
      existing.text = content;
      await existing.save();
    } else {
      await TopbarContent.create({ text: content });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
