import { type NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import adminModel from "@/lib/models/Admin";
import {
  findOneRecord,
  findOneAndUpdateRecord,
  CreateOneRecord,
  verifyPassword,
  hashPassword,
  generateJwtToken,
} from "@/lib/query/queryFn";

// Function to create initial admin if it doesn't exist
async function createInitialAdmin() {
  try {
    const existingAdmin = await findOneRecord(adminModel, {
      email: "admin@gmail.com",
    });

    if (!existingAdmin) {
      const hashedPassword = hashPassword("1234");

      await CreateOneRecord(adminModel, {
        email: "admin@gmail.com",
        password: hashedPassword,
      });

      // console.log("Initial admin user created")
    }
  } catch (error) {
    console.error("Error creating initial admin:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDb();

    // Create initial admin user if it doesn't exist
    await createInitialAdmin();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await findOneRecord(adminModel, { email });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = verifyPassword(admin.password, password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = generateJwtToken(admin._id.toString());

    await findOneAndUpdateRecord(adminModel, { _id: admin._id }, { token });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
