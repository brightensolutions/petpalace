import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Brand from "@/lib/models/Brand";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/brands");

async function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// GET /api/admin/brands/[id]
export async function GET(
  req: NextRequest,
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
    console.error("[v0] GET brand error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/brands/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const brand = await Brand.findByIdAndDelete(params.id);
    if (!brand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (err) {
    console.error("[v0] DELETE brand error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/brands/[id] (multipart/form-data)
// fields: name, slug, image (File)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    await ensureUploadDir();

    const form = await req.formData();
    const name = form.get("name")?.toString();
    const slug = form.get("slug")?.toString();
    const imageFile = form.get("image") as File | null;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Ensure unique name/slug excluding current document
    const existing = await Brand.findOne({
      _id: { $ne: params.id },
      $or: [{ name }, { slug }],
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Brand name or slug already exists" },
        { status: 409 }
      );
    }

    const update: any = { name, slug };

    // Handle image upload if provided
    if (
      imageFile &&
      typeof imageFile === "object" &&
      "arrayBuffer" in imageFile &&
      imageFile.size > 0
    ) {
      const allowed = ["png", "jpg", "jpeg", "webp"];
      const ext = imageFile.name.split(".").pop()?.toLowerCase() || "png";
      if (!allowed.includes(ext)) {
        return NextResponse.json(
          { success: false, message: "Unsupported image format" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `brand-${uuidv4()}.${ext}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      await writeFile(filePath, buffer);

      update.image = `/uploads/brands/${fileName}`;
    }

    const updated = await Brand.findByIdAndUpdate(params.id, update, {
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
    console.error("[v0] PUT brand error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
