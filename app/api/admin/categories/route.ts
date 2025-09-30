// File: /app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Category from "@/lib/models/Category";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public/categories");

async function ensureUploadDirExists() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// GET all categories
export async function GET() {
  await dbConnect();
  const categories = await Category.find();
  return NextResponse.json({ success: true, data: categories });
}

// POST create a new category
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    await ensureUploadDirExists();

    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const slug = formData.get("slug")?.toString();
    const image = formData.get("image") as File | null;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const existing = await Category.findOne({ name });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Category name already exists" },
        { status: 409 }
      );
    }

    let imageUrl = "";

    if (image && typeof image === "object") {
      const buffer = Buffer.from(await image.arrayBuffer());
      const ext = image.name.split(".").pop();
      const fileName = `category-${uuidv4()}.${ext}`;
      const fullPath = path.join(UPLOAD_DIR, fileName);

      await writeFile(fullPath, buffer);
      imageUrl = `/categories/${fileName}`;
    }

    const newCategory = await Category.create({
      name,
      slug,
      image: imageUrl,
    });

    return NextResponse.json(
      { success: true, data: newCategory },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST category error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
