import crypto from "crypto";

export class FallbackEmbeddingService {
  constructor() {
    this.dimensions = 384; // Match Hugging Face model dimensions
  }

  async createEmbedding(text) {
    try {
      // Create a deterministic hash-based embedding
      const hash = crypto.createHash("sha256").update(text).digest("hex");

      // Convert hash to numbers and normalize to create embedding-like vector
      const embedding = [];
      for (let i = 0; i < this.dimensions; i++) {
        const start = (i * 8) % hash.length;
        const end = start + 8;
        const chunk = hash.slice(start, end);
        const value = parseInt(chunk, 16) / 0xffffffff; // Normalize to 0-1
        embedding.push(value);
      }

      return embedding;
    } catch (error) {
      console.error("Error creating fallback embedding:", error);
      throw error;
    }
  }

  async embedQuery(text) {
    return this.createEmbedding(text);
  }
}
