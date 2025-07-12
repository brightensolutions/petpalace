import { type NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";
import { getUserFromToken } from "@/lib/utils/jwt";

export async function PUT(req: NextRequest) {
  try {
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    await connectDb();
    const userId = await getUserFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { addressId } = await req.json();

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let addressFound = false;
    user.addresses.forEach((addr: any) => {
      if (addr._id.toString() === addressId) {
        addr.isDefault = true;
        addressFound = true;
      } else {
        addr.isDefault = false;
      }
    });

    if (!addressFound) {
      return NextResponse.json(
        { success: false, error: "Address not found" },
        { status: 404 }
      );
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Default address updated",
    });
  } catch (error) {
    console.error("setDefaultAddress error:", error);
    return NextResponse.json(
      { error: "Unable to set default address" },
      { status: 500 }
    );
  }
}
