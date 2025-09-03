import { connectDB } from "@/lib/dbConnect";
import { Personas } from "@/models/personas.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async (req, { params }) => {
  await connectDB();

  const { id } = await params;
  if (!id) {
    throw new ApiError(400, "id of the persona required");
  }
  const persona = await Personas.findById(id);

  if (!persona) {
    ApiError(404, "no persona with this id");
  }

  return NextResponse.json(
    new ApiResponse(200, persona, "Persona details fetched successfully")
  );
});
