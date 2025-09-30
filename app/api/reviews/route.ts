import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";

// GET /api/reviews?productId=xxx - Fetch approved reviews for a product
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Only fetch approved reviews
    const reviews = await Review.find({
      product: productId,
      approved: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Submit a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, userName, userEmail, rating, title, comment } = body;

    // Validate required fields
    if (
      !productId ||
      !userName ||
      !userEmail ||
      !rating ||
      !title ||
      !comment
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Create review (will be pending approval)
    const review = await Review.create({
      product: productId,
      user_name: userName,
      user_email: userEmail,
      rating,
      title,
      comment,
      approved: false, // Requires admin approval
    });

    return NextResponse.json(
      {
        message:
          "Review submitted successfully. It will be visible after admin approval.",
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
