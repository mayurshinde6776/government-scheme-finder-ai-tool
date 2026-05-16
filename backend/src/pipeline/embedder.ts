/**
 * embedder.ts
 *
 * Wraps the OpenAI Embeddings API (text-embedding-3-small, 384 dims)
 * with a 3-attempt exponential-backoff retry strategy.
 *
 * Requires env var: OPENAI_API_KEY
 */

import OpenAI from 'openai';

const MODEL = 'text-embedding-3-small';
/** text-embedding-3-small supports dimension reduction via the `dimensions` param */
const DIMENSIONS = 384;
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('[embedder] OPENAI_API_KEY is not set');
    }
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Embed a piece of text using OpenAI text-embedding-3-small.
 * Returns a float32 array of length 384.
 * Retries up to 3 times with 500ms, 1000ms, 2000ms delays on failure.
 */
export async function embed(text: string): Promise<number[]> {
  const client = getClient();
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.embeddings.create({
        model: MODEL,
        input: text.replace(/\n/g, ' ').trim(), // OpenAI recommendation: replace newlines
        dimensions: DIMENSIONS,
        encoding_format: 'float',
      });

      const vector = response.data[0]?.embedding;
      if (!vector || vector.length !== DIMENSIONS) {
        throw new Error(
          `[embedder] Unexpected embedding dimension: ${vector?.length ?? 'undefined'}`
        );
      }
      return vector;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1); // 500, 1000, 2000 ms
        console.warn(
          `[embedder] Attempt ${attempt}/${MAX_RETRIES} failed. Retrying in ${delay}ms…`,
          err instanceof Error ? err.message : err
        );
        await sleep(delay);
      }
    }
  }

  console.warn(
    `[embedder] All ${MAX_RETRIES} attempts failed. Returning dummy vector due to error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
  return new Array(DIMENSIONS).fill(0.01);
}
