import { connectDB } from "@/lib/dbConnect";
import { Personas } from "@/models/personas.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req) => {
  await connectDB();

  const { personaname, description, promptDef } = await req.json();

  if (!personaname || !promptDef) {
    throw new ApiError(400, "Persona name and Promp definition required");
  }

  const persona = await Personas.create({
    personaname,
    description,
    promptDef,
  });

  return NextResponse.json(
    ApiResponse(200, "Manual Persona Added successfully")
  );
});

// GET - fetch all personas
export const GET = asyncHandler(async () => {
  await connectDB();

  const personas = await Personas.find({}).sort({ createdAt: -1 });

  if (!personas || personas.length === 0) {
    throw new ApiError(404, "No personas found");
  }

  return NextResponse.json(
    new ApiResponse(200, personas, "Personas fetched successfully")
  );
});
