import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Brand from "@/lib/models/Brand";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/brands");

async function ensureUploadDirExists() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// 🟩 GET all brands
export async function GET() {
  try {
    await dbConnect();
    const brands = await Brand.find();
    return NextResponse.json({ success: true, data: brands });
  } catch (err) {
    console.error("GET brands error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

// 🟩 POST add brand
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

    const existing = await Brand.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Brand name or slug already exists" },
        { status: 409 }
      );
    }

    let imageUrl = "";
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const ext = image.name.split(".").pop();
      const fileName = `brand-${uuidv4()}.${ext}`;
      const fullPath = path.join(UPLOAD_DIR, fileName);
      await writeFile(fullPath, buffer);
      imageUrl = `/uploads/brands/${fileName}`;
    }

    const newBrand = await Brand.create({ name, slug, image: imageUrl });
    return NextResponse.json(
      { success: true, data: newBrand },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST brand error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
