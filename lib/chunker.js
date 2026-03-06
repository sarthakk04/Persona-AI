import { CHUNK_SIZE, CHUNK_OVERLAP } from "@/constants";

/**
 * Strip HTML tags and collapse whitespace from raw text
 * (e.g. Tavily search snippets often contain HTML entities).
 * @param {string} text
 * @returns {string}
 */
export function cleanText(text) {
  return text
    .replace(/<[^>]+>/g, " ")      // remove HTML tags
    .replace(/&[a-z]+;/gi, " ")    // remove HTML entities like &amp;
    .replace(/\s+/g, " ")          // collapse whitespace
    .trim();
}

/**
 * Split text into overlapping chunks suitable for embedding.
 *
 * @param {string} text           - raw or cleaned input text
 * @param {number} chunkSize      - max characters per chunk  (default: CHUNK_SIZE from constants)
 * @param {number} overlap        - overlap between consecutive chunks (default: CHUNK_OVERLAP)
 * @returns {string[]}            - array of text chunks
 */
export function chunkText(
  text,
  chunkSize = CHUNK_SIZE,
  overlap = CHUNK_OVERLAP
) {
  const clean = cleanText(text);
  if (!clean) return [];

  const chunks = [];
  let start = 0;

  while (start < clean.length) {
    const end = Math.min(start + chunkSize, clean.length);
    const chunk = clean.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    if (end >= clean.length) break;
    start += chunkSize - overlap;
  }

  return chunks;
}
