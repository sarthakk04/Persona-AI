import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import { Conversations } from "@/models/conversations.models";
import { Messages } from "@/models/messages.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
// Correctly import the main class
import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = asyncHandler(async (req, { params }) => {
  await connectDB();
  const { id: convoId } = await params;
  const { content } = await req.json();

  if (!content) {
    throw new ApiError(400, "Message is required");
  }

  const conversation =
    await Conversations.findById(convoId).populate("persona");

  if (!conversation) {
    throw new ApiError(404, "Conversation Not Found"); // Changed to 404 for clarity
  }

  // Saving User message in the messages collection
  const userMessage = await Messages.create({
    conversationFrom: convoId,
    sender: "user",
    content,
  });

  // 1. Correctly initialize the SDK client
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // 2. Get the specific generative model you want to use
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // <-- CORRECT MODEL NAME

  // Build context: last 5 messages
  const history = await Messages.find({ conversationFrom: convoId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const formattedHistory = history
    .reverse()
    .map((msg) => `${msg.sender}: ${msg.content}`)
    .join("\n");

  const persona = conversation.persona;
  const personaPrompt = persona.promptDef?.systemPrompt || persona.description;

  // 3. Build the final prompt string
  const prompt = `You are ${persona.personaname}.
${personaPrompt}
Note: you need to be precise with the answer according to the persona mentioned for you, be true in your response.
Be precise and short , talh upto the point with the tone of the person you were supposed to

Conversation so far:
${formattedHistory}

User: ${content}
AI:`;

  // 4. Await the result from the model
  const result = await model.generateContent(prompt);

  // 5. 💡 BEST PRACTICE: Log the full API response for debugging
  // console.log(JSON.stringify(result, null, 2));

  // 6. Use the recommended helper function to safely get the text
  const response = result.response;
  const aiResponse = response.text().trim();

  if (!aiResponse) {
    // Check the reason for the empty response (e.g., safety filters)
    console.error(
      "AI response was empty. Finish Reason:",
      response.candidates?.[0]?.finishReason
    );
    throw new ApiError(500, "Failed to get a response from the AI."); // Changed to 500
  }

  // Save AI reply
  const aiMessage = await Messages.create({
    conversationFrom: convoId,
    sender: "ai",
    content: aiResponse,
  });

  return NextResponse.json(
    new ApiResponse(
      200,
      { userMessage, aiMessage },
      "Message handled successfully"
    )
  );
});

export const GET = asyncHandler(async (req, { params }) => {
  await connectDB();

  const { id: convoId } = params;
  const messages = await Messages.find({ conversationFrom: convoId }).sort({
    createdAt: 1,
  });

  return NextResponse.json(new ApiResponse(200, messages, "Messages fetched"));
});
