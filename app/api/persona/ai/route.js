import { connectDB } from "@/lib/dbConnect";
import { Personas } from "@/models/personas.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";
import { tavily } from "@tavily/core";
import { systemPrompt, userPrompt, CHUNK_SIZE, CHUNK_OVERLAP } from "@/constants";
import { createGroqClient } from "@/services/groq";
import { chunkText } from "@/lib/chunker";
import { embedBatch } from "@/services/embeddings";
import { upsertChunks, deleteByPersonaId } from "@/services/vectorClient";
import { randomUUID } from "crypto";
export const POST = asyncHandler(async (req) => {
  await connectDB();

  const { query } = await req.json();

  if (!query) {
    throw new ApiError(400, "Query for ai building is required");
  }

  // tavily workflow — run 3 targeted searches in parallel for richer grounding
  const tavilyAgent = tavily({ apiKey: process.env.TAVILY_API });
  if (!tavilyAgent) {
    throw new ApiError(401, "Tavily Key Required");
  }

  const [r1, r2, r3] = await Promise.all([
    tavilyAgent.search(`${query} interview quotes`),
    tavilyAgent.search(`${query} speaking style personality`),
    tavilyAgent.search(`${query} famous quotes catchphrases`),
  ]);

  // Collect all unique result contents (up to 3 per search = up to 9 snippets)
  const allSnippets = [...(r1.results || []), ...(r2.results || []), ...(r3.results || [])]
    .map((r) => r.content)
    .filter(Boolean);

  // Deduplicate by trimming and comparing first 100 chars
  const seen = new Set();
  const uniqueSnippets = allSnippets.filter((s) => {
    const key = s.trim().slice(0, 100);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Full rich text for RAG indexing (all snippets joined)
  const tavilyFullText = uniqueSnippets.join("\n\n") || query;

  // Compact summary for Groq persona extraction (first 3 snippets only)
  const tavilySummary = uniqueSnippets.slice(0, 3).join("\n\n") || query;

  if (!tavilySummary) {
    throw new ApiError(401, "Failed to generate tavily response");
  }

  //Feeding Tavily response to Groq for prompt generation
  const system = systemPrompt;
  const user = userPrompt(tavilySummary, query);

  // const groqOutput = createGroqClient(system, user);
  //TODO : uncomment later

  // Parse Groq output to JSON
  let personaObj;

  personaObj = await createGroqClient(system, user);

  if (!personaObj) {
    throw new ApiError(400, "Groq output is not valid JSON");
  }

  // Save to DB
  const person = await Personas.create(personaObj);

  // ── RAG: Index persona into Qdrant ───────────────────────────────────────
  // Run non-blocking — persona is already saved; a failed index should not
  // break the API response. Re-indexing will run on next persona update.
  (async () => {
    try {
      // Build a rich text blob from all persona fields worth retrieving
      const indexText = [
        person.personaname,
        person.description,
        person.promptDef?.systemPrompt,
        person.promptDef?.knowledge?.keyFacts?.join(" "),
        person.promptDef?.style?.mannerisms?.join(" "),
        tavilyFullText, // all raw external knowledge from Tavily (all 3 searches)
      ]
        .filter(Boolean)
        .join("\n\n");

      const chunks = chunkText(indexText, CHUNK_SIZE, CHUNK_OVERLAP);
      if (chunks.length === 0) return;

      // Delete stale vectors in case this persona was re-generated
      await deleteByPersonaId(person._id.toString());

      const vectors = await embedBatch(chunks);

      const points = chunks.map((text, i) => ({
        id: randomUUID(),
        vector: vectors[i],
        payload: {
          personaId: person._id.toString(),
          text,
          source: "persona",
          chunkIndex: i,
        },
      }));

      await upsertChunks(points);
      console.log(`[RAG] Indexed ${points.length} chunk(s) for persona: ${person.personaname}`);
    } catch (err) {
      console.error("[RAG] Failed to index persona — non-fatal:", err.message);
    }
  })();
  // ─────────────────────────────────────────────────────────────────────────

  // Return response
  return NextResponse.json(
    new ApiResponse(200, person, "Persona saved successfully")
  );
});
