import { asyncHandler } from "@/utils/asyncHandler";
import Groq from "groq-sdk";
export const createGroqClient = asyncHandler(async (system, user) => {
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

  return JSON.parse(groqOutput);
});
