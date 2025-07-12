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

    const addressData = await req.json();
    const { _id, ...updateFields } = addressData; // Extract _id and other fields

    if (!_id) {
      return NextResponse.json(
        { error: "Address ID is required for update" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const addressToUpdate = user.addresses.id(_id); // Mongoose subdocument .id() method
    if (!addressToUpdate) {
      return NextResponse.json(
        { success: false, error: "Address not found" },
        { status: 404 }
      );
    }

    // Validate required fields (similar to add route)
    if (
      !updateFields.name ||
      !updateFields.phone ||
      !updateFields.address ||
      !updateFields.city ||
      !updateFields.state ||
      !updateFields.pincode
    ) {
      return NextResponse.json(
        {
          error: "Missing required address fields",
          received: updateFields,
        },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
    if (!phoneRegex.test(updateFields.phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }
    // Validate pincode (6 digits for India)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(updateFields.pincode)) {
      return NextResponse.json(
        { error: "Invalid pincode format" },
        { status: 400 }
      );
    }

    // If this address is set as default, make all other addresses non-default
    if (updateFields.isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    // Update fields of the subdocument
    Object.assign(addressToUpdate, {
      name: updateFields.name.trim(),
      phone: updateFields.phone.trim(),
      company: updateFields.company ? updateFields.company.trim() : "",
      address: updateFields.address.trim(),
      city: updateFields.city.trim(),
      state: updateFields.state.trim(),
      pincode: updateFields.pincode.trim(),
      country: updateFields.country || "India",
      label: updateFields.label || "Home",
      isDefault: updateFields.isDefault,
    });

    await user.save();

    return NextResponse.json({ success: true, address: addressToUpdate });
  } catch (error) {
    console.error("updateAddress error:", error);
    return NextResponse.json(
      { error: "Unable to update address" },
      { status: 500 }
    );
  }
}
