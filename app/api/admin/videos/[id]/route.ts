import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Video from "@/lib/models/Video";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public/videos");

async function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const video = await Video.findById(params.id);
    if (!video)
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: video });
  } catch (err) {
    console.error("GET video error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const video = await Video.findById(params.id);
    if (!video)
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 }
      );

    if (video.url) {
      const videoPath = path.join(process.cwd(), "public", video.url);
      if (fs.existsSync(videoPath))
        await fs.promises.unlink(videoPath).catch(() => {});
    }

    await Video.findByIdAndDelete(params.id);
    return NextResponse.json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (err) {
    console.error("DELETE video error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    await ensureUploadDir();

    const formData = await req.formData();
    const title = formData.get("title")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const category = formData.get("category")?.toString().trim() || "";
    const videoFile = formData.get("video") as File | null;

    if (!title)
      return NextResponse.json(
        { success: false, message: "Video title is required" },
        { status: 400 }
      );

    let updateFields: any = { title, description, category };

    if (videoFile && typeof videoFile === "object") {
      const existingVideo = await Video.findById(params.id);
      if (existingVideo?.url) {
        const oldPath = path.join(process.cwd(), "public", existingVideo.url);
        if (fs.existsSync(oldPath))
          await fs.promises.unlink(oldPath).catch(() => {});
      }

      const buffer = Buffer.from(await videoFile.arrayBuffer());
      const ext = videoFile.name.split(".").pop();
      const fileName = `video-${uuidv4()}.${ext}`;
      const fullPath = path.join(UPLOAD_DIR, fileName);
      await writeFile(fullPath, buffer);
      updateFields.url = `/videos/${fileName}`;
    }

    const updated = await Video.findByIdAndUpdate(params.id, updateFields, {
      new: true,
    });
    if (!updated)
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT video error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
