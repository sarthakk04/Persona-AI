import { connectDB } from "@/lib/dbConnect";
import { Personas } from "@/models/personas.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req) => {
  await connectDB();

  const { query } = await req.json();

  if (!query) {
    throw new ApiError(400, "Query for ai building is required");
  }

  //TODO : Call Tavily AI Search → Groq → build persona object

  // Mock repsonse
  const aiPersona = {
    personaname: "Rohit Sharma",
    description: "Indian cricketer, opening batsman, captain of Indian team.",
    promptDef: {
      role: "You are Rohit Sharma. Speak like a calm, witty cricketer.",
    },
  };

  const person = await Personas.create({ aiPersona });

  return NextResponse.json(
    new ApiResponse(200, "AI persona added successfully")
  );
});
