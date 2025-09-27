// File: /app/api/admin/sliders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Slider from "@/lib/models/Slider";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// Upload folder path
const UPLOAD_DIR = path.join(process.cwd(), "public/sliders");

// Ensure the upload directory exists
async function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// 🟩 DELETE /api/admin/sliders/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const slider = await Slider.findById(params.id);
    if (!slider) {
      return NextResponse.json(
        { success: false, message: "Slider not found" },
        { status: 404 }
      );
    }

    // Remove image file from public folder
    if (slider.image) {
      const imagePath = path.join(process.cwd(), "public", slider.image);
      if (fs.existsSync(imagePath)) {
        await fs.promises.unlink(imagePath).catch(() => {});
      }
    }

    await Slider.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Slider deleted successfully",
    });
  } catch (err) {
    console.error("DELETE slider error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟩 GET /api/admin/sliders/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const slider = await Slider.findById(params.id);
    if (!slider) {
      return NextResponse.json(
        { success: false, message: "Slider not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: slider });
  } catch (err) {
    console.error("GET slider error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟩 PUT /api/admin/sliders/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    await ensureUploadDir();

    const formData = await req.formData();
    const link = formData.get("link")?.toString().trim() || "";
    const imageFile = formData.get("image") as File | null;

    if (!link) {
      return NextResponse.json(
        { success: false, message: "Slider link is required" },
        { status: 400 }
      );
    }

    let updateFields: any = { link };

    if (imageFile && typeof imageFile === "object") {
      // Delete old image
      const existingSlider = await Slider.findById(params.id);
      if (existingSlider?.image) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingSlider.image
        );
        if (fs.existsSync(oldImagePath)) {
          await fs.promises.unlink(oldImagePath).catch(() => {});
        }
      }

      // Save new image
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const ext = imageFile.name.split(".").pop();
      const fileName = `slider-${uuidv4()}.${ext}`;
      const fullPath = path.join(UPLOAD_DIR, fileName);

      await writeFile(fullPath, buffer);
      updateFields.image = `/sliders/${fileName}`;
    }

    const updated = await Slider.findByIdAndUpdate(params.id, updateFields, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Slider not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT slider error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
