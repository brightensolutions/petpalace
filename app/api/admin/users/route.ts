import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";

export async function GET() {
  await connectDb();
  const users = await User.find();
  return Response.json(users);
}
