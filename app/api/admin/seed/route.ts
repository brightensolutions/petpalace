// app/api/admin/seed/route.ts
import { NextResponse } from "next/server";
import connectDb from "@/lib/db/db"; // your DB connection function
import Admin from "@/lib/models/Admin"; // your Admin model
import { hashPassword } from "@/lib/query/queryFn"; // your hash function

export async function GET() {
  try {
    await connectDb();

    const existing = await Admin.findOne({ email: "admin@gmail.com" });

    if (existing) {
      return NextResponse.json(
        { message: "✅ Super Admin already exists." },
        { status: 200 }
      );
    }

    const hashedPassword = hashPassword("admin123");

    const admin = new Admin({
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "superadmin",
    });

    await admin.save();

    return NextResponse.json(
      { message: "✅ Super Admin created successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Failed to seed admin:", error);
    return NextResponse.json(
      { message: "❌ Failed to seed admin", error: error.message },
      { status: 500 }
    );
  }
}
