import { connectDB } from "@/lib/dbConnect";
import { Conversations } from "@/models/conversations.models";
import { Users } from "@/models/users.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req) => {
  await connectDB();

  const { username, personaId } = await req.json();

  if (!username || !personaId) {
    throw new ApiError(400, "Username and personaId required");
  }

  const user = await Users.findOne({
    username,
  });

  if (!user) {
    throw new ApiError(401, "Username doesnt exists");
  }

  //Create a convo

  const conversation = await Conversations.create({
    user: user._id,
    persona: personaId,
  });

  return NextResponse.json(
    new ApiResponse(200, conversation._id, "Conversation added successfully")
  );
});

// List all the conversations of that specific user

export const GET = asyncHandler(async (res) => {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    throw new ApiError(400, "username not present while getting from URL");
  }

  //get User
  const user = await Users.findOne({
    username,
  });

  if (!user) {
    throw new ApiError(
      401,
      "username mentioned in the url is not present in the Database"
    );
  }

  const conversations = await Conversations.find({ user: user._id })
    .populate("persona", "personaname description")
    .sort({ createdAt: -1 });

  return NextResponse.json(
    new ApiResponse(200, `conversations of ${username} fetched success`)
  );
});
