// app/api/test/route.ts

import connectDb from "@/lib/db/db";

// ✅ GET handler without unused `request` param
export async function GET() {
  try {
    await connectDb();

    return new Response(JSON.stringify({ message: "✅ MongoDB Connected" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ DB Connection Error:", (error as Error).message);

    return new Response(
      JSON.stringify({ error: "❌ Failed to connect to MongoDB" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
