import { type NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";
import { getUserFromToken } from "@/lib/utils/jwt";

export async function POST(req: NextRequest) {
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
    // Log the received data for debugging
    console.log("Received address data:", addressData);
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Validate required fields based on AddressSchema
    if (
      !addressData.name ||
      !addressData.phone ||
      !addressData.address ||
      !addressData.city ||
      !addressData.state ||
      !addressData.pincode
    ) {
      return NextResponse.json(
        {
          error: "Missing required address fields",
          received: addressData,
        },
        { status: 400 }
      );
    }
    // Validate phone number format (basic validation)
    const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
    if (!phoneRegex.test(addressData.phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }
    // Validate pincode (6 digits for India)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(addressData.pincode)) {
      return NextResponse.json(
        { error: "Invalid pincode format" },
        { status: 400 }
      );
    }
    // If this is set as default, make all other addresses non-default
    if (addressData.isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }
    // Create the new address object with all fields
    const newAddress = {
      name: addressData.name.trim(),
      phone: addressData.phone.trim(),
      company: addressData.company ? addressData.company.trim() : "",
      address: addressData.address.trim(),
      city: addressData.city.trim(),
      state: addressData.state.trim(),
      pincode: addressData.pincode.trim(),
      country: addressData.country || "India",
      label: addressData.label || "Home",
      isDefault: addressData.isDefault || user.addresses.length === 0,
    };
    // Log the new address object for debugging
    console.log("New address object:", newAddress);
    user.addresses.push(newAddress);
    await user.save();
    // Log the saved user addresses for debugging
    console.log("Saved addresses:", user.addresses);
    return NextResponse.json({
      success: true,
      address: user.addresses[user.addresses.length - 1],
    });
  } catch (error) {
    console.error("addAddress error:", error);
    return NextResponse.json(
      { error: "Unable to add address" },
      { status: 500 }
    );
  }
}
