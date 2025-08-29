import { connectDB } from "@/lib/dbConnect";
import { Users } from "@/models/users.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req) => {
  await connectDB();

  const body = await req.json();
  const { username } = body;

  if (!username) {
    throw new ApiError(401, "Username is Required");
  }

  const existing = await Users.findOne({
    username,
  });

  if (existing) {
    throw new ApiError(400, "username already exists");
  }

  const user = await Users.create({
    username: username,
  });

  return NextResponse.json(
    new ApiResponse(200, user, "user registered successfully")
  );
});
