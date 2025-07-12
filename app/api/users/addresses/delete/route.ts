import { type NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";
import { getUserFromToken } from "@/lib/utils/jwt";

export async function DELETE(req: NextRequest) {
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

    const initialAddressCount = user.addresses.length;
    user.addresses = user.addresses.filter(
      (addr: any) => addr._id.toString() !== addressId
    );

    if (user.addresses.length === initialAddressCount) {
      return NextResponse.json(
        { success: false, error: "Address not found" },
        { status: 404 }
      );
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("deleteAddress error:", error);
    return NextResponse.json(
      { error: "Unable to delete address" },
      { status: 500 }
    );
  }
}
