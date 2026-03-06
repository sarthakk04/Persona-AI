import { GoogleGenerativeAI } from "@google/generative-ai";

// Only embedding model available on Gemini free tier — 3072-dimensional vectors
export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSION = 3072;

let _client = null;
function getClient() {
  if (!_client) _client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return _client;
}

/**
 * Embed a single string → number[]
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function embedText(text) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: EMBEDDING_MODEL });
  const result = await model.embedContent(text.trim());
  return result.embedding.values;
}

/**
 * Embed multiple strings → number[][]
 * Fires requests concurrently, capped at 10 for rate-limit safety.
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
export async function embedBatch(texts) {
  const CONCURRENCY = 10;
  const results = [];
  for (let i = 0; i < texts.length; i += CONCURRENCY) {
    const slice = texts.slice(i, i + CONCURRENCY);
    const batch = await Promise.all(slice.map((t) => embedText(t)));
    results.push(...batch);
  }
  return results;
}
