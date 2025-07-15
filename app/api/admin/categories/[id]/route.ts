import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Category from "@/lib/models/Category";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// Upload folder path
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/categories");

async function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// 🟩 DELETE /api/admin/categories/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const category = await Category.findByIdAndDelete(params.id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.error("DELETE category error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟩 GET /api/admin/categories/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (err) {
    console.error("GET category error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟩 PUT /api/admin/categories/[id]
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
    const parentId = formData.get("parentId") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if name already exists (excluding current ID)
    const existing = await Category.findOne({ name, _id: { $ne: params.id } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Category name already exists" },
        { status: 409 }
      );
    }

    let updateFields: any = {
      name,
      slug,
      parentId: parentId || null,
    };

    if (imageFile && typeof imageFile === "object") {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const ext = imageFile.name.split(".").pop();
      const fileName = `cat-${uuidv4()}.${ext}`;
      const fullPath = path.join(UPLOAD_DIR, fileName);

      await writeFile(fullPath, buffer);
      updateFields.image = `/uploads/categories/${fileName}`;
    }

    const updated = await Category.findByIdAndUpdate(params.id, updateFields, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT category error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
