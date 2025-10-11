import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      userId,
      items,
      pets,
      address,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      couponCode,
      notes,
    } = body;

    if (!userId || !items || !address) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD${Date.now()}${orderCount + 1}`;

    // Create order
    const order = await Order.create({
      userId,
      orderNumber,
      items,
      pets,
      address,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      couponCode,
      notes,
    });

    // Update user's pets if new pets were added
    if (pets && pets.length > 0) {
      const user = await User.findById(userId);
      if (user) {
        // Add new pets to user's pets array (avoid duplicates by name)
        const existingPetNames = user.pets.map((p: any) =>
          p.name.toLowerCase()
        );
        const newPets = pets
          .filter(
            (pet: any) => !existingPetNames.includes(pet.name.toLowerCase())
          )
          .map((pet: any) => ({
            petId: `pet_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            name: pet.name,
            type: pet.type,
            breed: pet.breed,
            dob: pet.birthdate,
            gender: "Unknown",
          }));

        if (newPets.length > 0) {
          user.pets.push(...newPets);
          await user.save();
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId");

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
