import { QdrantClient } from "@qdrant/js-client-rest";
import { EMBEDDING_DIMENSION } from "./embeddings.js";

const DEFAULT_COLLECTION = process.env.QDRANT_COLLECTION || "persona_knowledge";

let _client = null;
function getClient() {
  if (!_client) {
    _client = new QdrantClient({
      url: process.env.QDRANT_URL || "http://localhost:6333",
      ...(process.env.QDRANT_API_KEY
        ? { apiKey: process.env.QDRANT_API_KEY }
        : {}),
    });
  }
  return _client;
}

/**
 * Create the Qdrant collection if it doesn't already exist.
 * Safe to call on every request — skips if already present.
 * @param {string} collectionName
 */
export async function ensureCollection(collectionName = DEFAULT_COLLECTION) {
  const client = getClient();
  const { collections } = await client.getCollections();
  const exists = collections.some((c) => c.name === collectionName);
  if (!exists) {
    await client.createCollection(collectionName, {
      vectors: { size: EMBEDDING_DIMENSION, distance: "Cosine" },
    });
    console.log(`[Qdrant] Collection created: ${collectionName}`);
  }
}

/**
 * Upsert a batch of chunks into the collection.
 *
 * @param {Array<{
 *   id: string,
 *   vector: number[],
 *   payload: {
 *     personaId: string,
 *     text: string,
 *     source: string,
 *     chunkIndex: number,
 *     [key: string]: any
 *   }
 * }>} chunks
 * @param {string} collectionName
 */
export async function upsertChunks(chunks, collectionName = DEFAULT_COLLECTION) {
  const client = getClient();
  await ensureCollection(collectionName);
  await client.upsert(collectionName, {
    wait: true,
    points: chunks.map(({ id, vector, payload }) => ({ id, vector, payload })),
  });
  console.log(`[Qdrant] Upserted ${chunks.length} chunk(s) into ${collectionName}`);
}

/**
 * Semantic nearest-neighbour search, optionally filtered by payload fields.
 *
 * @param {{
 *   queryVector: number[],
 *   filter?: Record<string, string>,   // e.g. { personaId: "kohli123" }
 *   topK?: number,
 *   collectionName?: string
 * }} opts
 * @returns {Promise<Array<{ id, score, payload }>>}
 */
export async function querySimilar({
  queryVector,
  filter = {},
  topK = 5,
  collectionName = DEFAULT_COLLECTION,
}) {
  const client = getClient();

  const qdrantFilter =
    Object.keys(filter).length > 0
      ? {
          must: Object.entries(filter).map(([key, value]) => ({
            key,
            match: { value },
          })),
        }
      : undefined;

  const results = await client.search(collectionName, {
    vector: queryVector,
    limit: topK,
    filter: qdrantFilter,
    with_payload: true,
  });

  return results; // [{ id, version, score, payload, ... }]
}

/**
 * Delete all vectors belonging to a specific persona.
 * Call this before re-indexing an updated persona.
 * @param {string} personaId
 * @param {string} collectionName
 */
export async function deleteByPersonaId(
  personaId,
  collectionName = DEFAULT_COLLECTION
) {
  const client = getClient();
  await client.delete(collectionName, {
    wait: true,
    filter: {
      must: [{ key: "personaId", match: { value: personaId } }],
    },
  });
  console.log(`[Qdrant] Deleted all vectors for personaId: ${personaId}`);
}
