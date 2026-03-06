import Groq from "groq-sdk";

export const createGroqClient = async (system, user) => {
  const groq = new Groq();
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user.join("\n") },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    max_completion_tokens: 1200,
    top_p: 1,
    stream: false,
    stop: null,
    response_format: { type: "json_object" },
  });

  const groqOutput =
    chatCompletion.choices[0]?.message?.content || "{}";

  // Strip markdown code fences if present (safety net)
  const cleaned = groqOutput
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(cleaned);
};
