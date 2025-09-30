// File: /app/api/admin/brands/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Brand from "@/lib/models/Brand";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Upload folder path
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/brands");

async function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// 🟩 DELETE /api/admin/brands/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const brand = await Brand.findByIdAndDelete(params.id);
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (err) {
    console.error("DELETE brand error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟩 GET /api/admin/brands/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const brand = await Brand.findById(params.id);
    if (!brand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: brand });
  } catch (err) {
    console.error("GET brand error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟩 PUT /api/admin/brands/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    await ensureUploadDir();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if name already exists (excluding current ID)
    const existing = await Brand.findOne({ name, _id: { $ne: params.id } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Brand name already exists" },
        { status: 409 }
      );
    }

    let updateFields: any = { name, slug };

    if (imageFile && typeof imageFile === "object") {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const ext = imageFile.name.split(".").pop();
      const fileName = `brand-${uuidv4()}.${ext}`;
      const fullPath = path.join(UPLOAD_DIR, fileName);

      await writeFile(fullPath, buffer);
      updateFields.image = `/uploads/brands/${fileName}`;
    }

    const updated = await Brand.findByIdAndUpdate(params.id, updateFields, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT brand error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
