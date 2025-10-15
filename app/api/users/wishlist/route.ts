import { type NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db/db";
import Wishlist from "@/lib/models/Wishlist";
import User from "@/lib/models/User";
import { getUserFromToken } from "@/lib/utils/jwt";

// GET /api/users/wishlist
export async function GET(req: NextRequest) {
  try {
    console.log("[v0][wishlist][API] GET start");
    await connectDb();

    const userId = await getUserFromToken(req);
    console.log("[v0][wishlist][API] userId:", userId);
    if (!userId) {
      console.warn("[v0][wishlist][API] Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const docs = await Wishlist.find({ userId })
      .populate({
        path: "productId",
        model: "Product",
        select: "name slug main_image image images base_price mrp category",
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log("[v0][wishlist][API] docs length:", docs.length);
    if (docs[0]) {
      const p = docs[0]?.productId || {};
      const pAny = p as any;
      console.log(
        "[v0][wishlist][API] sample doc[0] keys:",
        Object.keys(docs[0] || {})
      );
      console.log(
        "[v0][wishlist][API] sample product keys:",
        pAny ? Object.keys(pAny) : []
      );
      console.log("[v0][wishlist][API] sample product preview:", {
        _id: pAny?._id,
        name: pAny?.name,
        main_image: pAny?.main_image,
        image: pAny?.image,
        imagesType: Array.isArray(pAny?.images) ? "array" : typeof pAny?.images,
        base_price: pAny?.base_price,
        mrp: pAny?.mrp,
        category:
          typeof pAny?.category === "object"
            ? pAny?.category?.name
            : pAny?.category,
      });
    }

    const wishlist = docs.map((doc: any) => {
      const p = doc?.productId || {};
      const pAny = p as any;

      const pid =
        (pAny?._id && pAny._id.toString?.()) ||
        (typeof doc?.productId === "string" ? doc.productId : undefined) ||
        doc?._id?.toString?.() ||
        "";

      const image =
        pAny?.main_image ||
        pAny?.image ||
        (Array.isArray(pAny?.images) ? pAny.images[0] : undefined) ||
        "/wishlist-product.jpg";

      const price =
        Number.isFinite(Number(pAny?.base_price)) && Number(pAny.base_price) > 0
          ? Number(pAny.base_price)
          : Number(pAny?.mrp) || 0;

      const category =
        (typeof pAny?.category === "object"
          ? pAny.category?.name
          : pAny?.category) || "Product";

      return {
        _id: doc?._id?.toString?.() || pid || "",
        productId: pid,
        name: pAny?.name || "Product",
        slug: pAny?.slug || "",
        price,
        image,
        category,
        createdAt: doc?.createdAt || null,
        updatedAt: doc?.updatedAt || null,
      };
    });

    console.log("[v0][wishlist][API] response length:", wishlist.length);
    if (wishlist[0]) {
      console.log("[v0][wishlist][API] response sample:", {
        _id: wishlist[0]._id,
        productId: wishlist[0].productId,
        name: wishlist[0].name,
        image: String(wishlist[0].image || "").slice(0, 120),
        price: wishlist[0].price,
        category: wishlist[0].category,
      });
    }

    return NextResponse.json({ wishlist });
  } catch (error) {
    console.error("[v0][wishlist][API] Get wishlist error:", error);
    return NextResponse.json(
      {
        error: "Unable to fetch wishlist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/users/wishlist
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { number } = body || {};

    await connectDb();

    const user = await User.findOne({ number });
    return NextResponse.json({ exists: !!user });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
