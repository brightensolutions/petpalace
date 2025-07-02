import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // or use relative path if alias fails

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("petpalace");
    const collections = await db.listCollections().toArray();

    return NextResponse.json({ success: true, collections });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
