import { NextRequest } from "next/server";
import connectDb from "@/lib/db/db";
import User from "@/lib/models/User";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  await connectDb();
  const user = await User.findById(params.id);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  return Response.json(user);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  await connectDb();
  const data = await req.json();
  const updatedUser = await User.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  if (!updatedUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  return Response.json(updatedUser);
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  await connectDb();
  const deletedUser = await User.findByIdAndDelete(params.id);
  if (!deletedUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  return Response.json({ message: "User deleted successfully" });
}
