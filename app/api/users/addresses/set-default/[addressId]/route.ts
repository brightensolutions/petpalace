import { type NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";
import { getUserFromToken } from "@/lib/utils/jwt";
import type { Address } from "@/lib/types/address";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ addressId: string }> }
) {
  try {
    await connectDb();
    const userId = await getUserFromToken(req);
    const params = await props.params;
    const addressId = params.addressId;

    if (!userId || !addressId) {
      return NextResponse.json(
        { error: "Missing user or address ID" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Type the address properly instead of using any
    user.addresses.forEach((address: Address) => {
      address.isDefault = address._id.toString() === addressId;
    });

    await user.save();

    return NextResponse.json(user.addresses);
  } catch (error) {
    console.error("setDefaultAddress error:", error);
    return NextResponse.json(
      { error: "Unable to set default address" },
      { status: 500 }
    );
  }
}
