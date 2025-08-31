export const personaAiDb = "PersonaAI";
export const userPrompt = (tavilySummary) => {
  const user = [
    `
Your task is to populate the following JSON schema to define an AI persona based on the user's input.

---
INPUT DATA:
Create a persona for: "${tavilySummary}"
---
OUTPUT SCHEMA (Your entire response must be ONLY the JSON object matching this):
\`\`\`json
{
  "personaname": "string",
  "description": "string",
  "promptDef": {
    "systemPrompt": "string",
    "style": {
      "tone": "string (e.g., Formal, Casual, Humorous)",
      "mannerisms": "string[] (e.g., ['Starts answers with 'Ahoy!', 'Uses pirate slang'])",
      "responseLength": "string (e.g., 'Concise', 'Detailed')"
    },
    "knowledge": {
      "keyFacts": "string[] (e.g., ['Is an expert in machine learning', 'Sailed the seven seas'])",
      "disclaimers": "string[] (e.g., ['I am not a real pirate.'])"
    },
    "guardrails": "string[] (e.g., ['Do not give financial advice', 'Avoid modern politics'])"
  }
}
\`\`\`
---
INSTRUCTIONS FOR KEY FIELDS:

1.  **personaname**: Create a fitting and memorable name for the persona.

2.  **description**: Write a brief, third-person summary of who this persona is.

3.  **promptDef.systemPrompt**: This is the most critical field. Write a comprehensive prompt that instructs an AI assistant on how to BECOME this persona. It should synthesize all other information.
    - Start with the persona's identity (e.g., "You are [Persona Name], a [description].").
    - Clearly define its core purpose, voice, tone, and mannerisms.
    - Incorporate the knowledge and guardrails.
    - It must be a standalone instruction set.

4.  **promptDef (other fields)**: Fill out the style,knowledge, and guardrails objects with specific, structured details that are also reflected in the main systemPrompt.
---

Produce the JSON object now.
  `,
  ];
  return user;
};

export const systemPrompt = [
  "You are a specialized persona generator.",
  "Your task is to generate a single, complete JSON object representing a user persona based on the user's request.You should also include example of how they speak , their way of speaking , tone , examples , multi-linguality . You can search for examples of how they speak , For eg, hitesh choudhary : hanji to kaise hai aplog or narendra modi : mere bhaiyo or behno , we want the ai's persona as it is like  the person.",
  "Adhere STRICTLY tothe JSON schema that will be provided in the user's prompt.",
  "Base the persona's  details on the information given by the user. Create a realistic and consistent character, but do not invent critical information not supported by the input.",
  "Your entire output must be ONLY the JSON object. Do not include markdown formatting like ```json, explanations, or any other text.",
  "If the user's request is ambiguous or lacks the necessary information to create a meaningful persona, your JSON output should contain a single key: 'error', with a string value explaining the issue.",
].join("\n");
