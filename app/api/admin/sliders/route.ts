// File: /app/api/admin/sliders/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Slider from "@/lib/models/Slider";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public/sliders");

async function ensureUploadDirExists() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const sliders = await Slider.find();
    return NextResponse.json({ success: true, data: sliders });
  } catch (err) {
    console.error("GET sliders error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch sliders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    await ensureUploadDirExists();

    const formData = await req.formData();
    const link = formData.get("link")?.toString() || "";
    const image = formData.get("image") as File | null;

    if (!link) {
      return NextResponse.json(
        { success: false, message: "Slider link is required" },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Slider image is required" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (image && typeof image === "object") {
      const buffer = Buffer.from(await image.arrayBuffer());
      const ext = image.name.split(".").pop();
      const fileName = `slider-${uuidv4()}.${ext}`;
      const fullPath = path.join(UPLOAD_DIR, fileName);

      await writeFile(fullPath, buffer);
      imageUrl = `/sliders/${fileName}`;
    }

    const newSlider = await Slider.create({
      image: imageUrl,
      link,
    });

    return NextResponse.json(
      { success: true, data: newSlider },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST slider error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
