import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/db/db";
import Blog from "@/lib/models/Blog";

const UPLOAD_DIR = path.join(process.cwd(), "public", "blogs");

async function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: blogs });
  } catch (err) {
    console.error("GET blogs error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    await ensureUploadDir();

    const formData = await req.formData();

    const title = formData.get("title")?.toString().trim();
    const content = formData.get("content")?.toString();
    const author = formData.get("author")?.toString().trim() || "";
    const activeRaw = formData.get("active")?.toString().trim();
    const metaTitle = formData.get("metaTitle")?.toString().trim() || "";
    const metaDescription =
      formData.get("metaDescription")?.toString().trim() || "";
    const slug = formData.get("slug")?.toString().trim();
    const category = formData.get("category")?.toString().trim() || "";
    const thumbnailFile =
      (formData.get("thumbnail") as File | null) ||
      (formData.get("image") as File | null);

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 }
      );
    }

    const contentText = (content || "").replace(/<[^>]*>/g, "").trim();
    if (!content || !contentText) {
      return NextResponse.json(
        { success: false, message: "Content is required" },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      );
    }

    // Require non-empty category
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category is required" },
        { status: 400 }
      );
    }

    // Require an image file upload (thumbnail or image)
    if (!thumbnailFile || typeof thumbnailFile !== "object") {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        { status: 400 }
      );
    }

    // Always save image since it's required, and reuse for both fields
    let imagePath = "";
    {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const ext = thumbnailFile.name.split(".").pop();
      const fileName = `blog-${uuidv4()}.${ext}`;
      const fullPath = path.join(UPLOAD_DIR, fileName);
      await writeFile(fullPath, buffer);
      imagePath = `/blogs/${fileName}`;
    }

    // Set category and image without defaulting to empty strings
    const doc: any = {
      title,
      slug,
      content,
      author,
      category, // required - already validated
      thumbnail: imagePath, // store uploaded path
      image: imagePath, // for schemas that require `image`
      active: typeof activeRaw === "string" ? activeRaw === "true" : true,
      metaTitle,
      metaDescription,
      status: "draft",
    };

    const created = await Blog.create(doc);

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    console.error("[v0] POST /api/admin/blogs error:", err?.message || err);
    if (err?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Slug must be unique" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
