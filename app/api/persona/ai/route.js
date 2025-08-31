import { connectDB } from "@/lib/dbConnect";
import { Personas } from "@/models/personas.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";
import { tavily } from "@tavily/core";
import Groq from "groq-sdk";
import { systemPrompt, userPrompt } from "@/constants";
export const POST = asyncHandler(async (req) => {
  await connectDB();

  const { query } = await req.json();

  if (!query) {
    throw new ApiError(400, "Query for ai building is required");
  }

  // tavily workflow
  const tavilyAgent = tavily({ apiKey: process.env.TAVILY_API });
  if (!tavilyAgent) {
    throw new ApiError(401, "Tavily Key Required");
  }
  const tavilyResponse = await tavilyAgent.search(query);
  // groq doesnt accepts string so getting summary from response
  const tavilySummary = tavilyResponse.results?.[0]?.content || query;

  if (!tavilyResponse) {
    throw new ApiError(401, "Failed to generate tavily response");
  }

  //Feeding Tavily response to Groq for prompt generation
  const system = systemPrompt;
  const user = userPrompt(tavilySummary);
  const groq = new Groq();
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user.join("\n") },
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
    max_completion_tokens: 1200,
    top_p: 1,
    stream: false,
    stop: null,
  });

  const groqOutput =
    chatCompletion.choices[0]?.message?.content || "No content";
  //TODO : uncomment later


  // Parse Groq output to JSON
  let personaObj;

  personaObj = JSON.parse(groqOutput);

  if (!personaObj) {
    throw new ApiError(400, "Groq output is not valid JSON");
  }

  // Save to DB
  const person = await Personas.create(personaObj);

  // Return response
  return NextResponse.json(
    new ApiResponse(200, person, "Persona saved successfully")
  );
});

// To install: npm i @tavily/core
// const { tavily } = require('@tavily/core');
// const client = tavily({ apiKey: "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" });
// client.search("")
// .then(console.log);
