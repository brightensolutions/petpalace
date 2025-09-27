import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Blog from "@/lib/models/Blog";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "blogs");

async function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// DELETE /api/admin/blogs/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    // Delete thumbnail if exists
    if (blog.thumbnail) {
      const thumbnailPath = path.join(process.cwd(), "public", blog.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        await fs.promises.unlink(thumbnailPath).catch(() => {});
      }
    }

    await Blog.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    console.error("DELETE blog error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET /api/admin/blogs/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (err) {
    console.error("GET blog error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blogs/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const thumbnailFile = formData.get("thumbnail") as File | null;

    const existingBlog = await Blog.findById(params.id);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    const updateFields: any = {
      title: title || existingBlog.title,
      content: content?.replace(/<[^>]*>/g, "").trim()
        ? content
        : existingBlog.content,
      author,
      active:
        typeof activeRaw === "string"
          ? activeRaw === "true"
          : existingBlog.active,
      metaTitle,
      metaDescription,
      slug: slug || existingBlog.slug,
      category: category || existingBlog.category,
      thumbnail: existingBlog.thumbnail,
    };

    // Handle thumbnail update
    if (thumbnailFile && typeof thumbnailFile === "object") {
      // Delete old thumbnail if exists
      if (existingBlog.thumbnail) {
        const oldThumbnailPath = path.join(
          process.cwd(),
          "public",
          existingBlog.thumbnail
        );
        if (fs.existsSync(oldThumbnailPath)) {
          await fs.promises.unlink(oldThumbnailPath).catch(() => {});
        }
      }

      // Save new thumbnail
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const ext = thumbnailFile.name.split(".").pop();
      const fileName = `blog-${uuidv4()}.${ext}`;
      const fullPath = path.join(UPLOAD_DIR, fileName);
      await writeFile(fullPath, buffer);

      updateFields.thumbnail = `/blogs/${fileName}`;
      updateFields.image = `/blogs/${fileName}`;
    }

    console.log("[v0] Updating blog:", {
      id: params.id,
      updateFields: Object.keys(updateFields),
    });

    const updated = await Blog.findByIdAndUpdate(params.id, updateFields, {
      new: true,
      runValidators: true, // important to validate schema
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("PUT blog error:", err?.message || err);
    if (err?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Slug must be unique" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
