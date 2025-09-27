import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Video from "@/lib/models/Video";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public/videos");

async function ensureUploadDirExists() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const videos = await Video.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: videos });
  } catch (err) {
    console.error("GET videos error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    await ensureUploadDirExists();

    const formData = await req.formData();
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const videoFile = formData.get("video") as File | null;

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title required" },
        { status: 400 }
      );
    }
    if (!videoFile) {
      return NextResponse.json(
        { success: false, message: "Video file required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await videoFile.arrayBuffer());
    const ext = videoFile.name.split(".").pop();
    const fileName = `video-${uuidv4()}.${ext}`;
    const fullPath = path.join(UPLOAD_DIR, fileName);

    await writeFile(fullPath, buffer);
    const videoPath = `/videos/${fileName}`;

    const newVideo = await Video.create({
      title,
      description,
      category,
      videoUrl: videoPath, // ✅ must match model
    });

    return NextResponse.json(
      { success: true, data: newVideo },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST video error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
